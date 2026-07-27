import { FileSystem, FStats } from "./FileSystem.js";
import * as FB from "../../Firebase/firebase.js";

FB.initialise();
const db = FB.getFirestore();
const { writeBatch, collection, query, where, onSnapshot, getDocs, doc, updateDoc } = FB.FStore;

/**
 * @typedef {Object} FileDescriptor
 * @property {boolean} isDirectory - Indicates if the descriptor represents a directory.
 * @property {?string} [fileID] - Indicates if the descriptor represents a file.
 * @property {number} [dateCreated] - The timestamp when the file or directory was created.
 * @property {number} [lastUpdated] - The timestamp when the file or directory was last updated.
 */

const P2K_REPLACERS = [
    [/\//g, "~0~"],
    [/\./g, "~1~"],
    [/#/g,  "~2~"],
    [/\$/g, "~3~"],
    [/\[/g, "~4~"],
    [/\]/g, "~5~"],
]

const K2P_REPLACES = [
    [/~0~/g, "/"],
    [/~1~/g, "."],
    [/~2~/g, "#"],
    [/~3~/g, "$"],
    [/~4~/g, "["],
    [/~5~/g, "]"],
]

function path2key(path) {
    if (/~\[0-5]+~/.test(path)) {
        throw new Error("File paths cannot contain the sequence ~[0-5]+~ as it is reserved for escaping special characters.");
    }
    for (const [regex, repl] of P2K_REPLACERS) {
        path = path.replace(regex, repl);
    }
    return path;
}

function key2path(key) {
    let path = key;
    for (const [reg, val] of K2P_REPLACES) {
        path = path.replace(reg, val);
    }
    return path;
}

const VALID_KEYS = {
    "isDirectory": true,
    "public": true,
    "favourite": true,
    "deletedAt": true,
    "effectivePublic": true,
    "path": true,
}
/**
 * @template {FStats} T
 * @extends {FileSystem<T>}
 * @classdesc A file system that interacts with Firebase Realtime Database.
 */
export class FStoreFileSystem extends FileSystem {
     /** @type {FirebaseFrame} */
    #user = null;
    #collection = null;
    #changedKeySet = {};
    #writeSet = {};
    #changedKeySetTimeout = false;
    #unsubscribe = null;
    #watchPromise = null;

    #commitHistoryDelay = 100;
    #commitHistoryTimeout = null;


    #key2docID = {};

    /**
     * @param {string} ref The Firebase reference path for the file system.
     * @param {new (path: string, contents: any, dirOverride: boolean) => T} fstatClass The class to use for file statistics.
     * @constructor
     */
    constructor(user, col, fstatClass = FStats) {
        super(fstatClass);
        this.#collection = collection(db, col);
        this.#user = user;
    }

    _createDirectory(path) {
        this._set(path, {
            isDirectory: true,
            deletedAt: false,
        });
    }

    _deleteFile(path, commitHistory = true) {
        let isChanged = super._deleteFile(path, commitHistory);
        if (isChanged) {
            this.#setPath(path, null);
        }
    }

    _set(path, value, commitHistory = true) {
        let isChanged = super._set(path, value, commitHistory);
        if (isChanged) {
            this.#setPath(path, value, commitHistory);
        }
    }

    async #pushDocUpdate(id, data, batch) {
        try {
            const docRef = doc(this.#collection, id)
            if (batch) {
                batch.update(docRef, data);
            } else {
                await updateDoc(docRef, data);
            }
        } catch (error) {
            console.warn("Error updating document:", error);
        }
    }
    async #pushDocSet(id, data, batch) {
        try {
            const docRef = doc(this.#collection, id)
            if (batch) {
                batch.set(docRef, data);
            } else {
                await setDoc(docRef, data);
            }
        } catch (error) {
            console.warn("Error setting document:", error);
        }
    }

    #setPath(path, value, commitHistory = true) {
        const key = path2key(path.toString());
        console.log("Setting path:", path.toString(), "value:", value);
        if (value === null) {
            const id = this.#key2docID[key];
            this.#changedKeySet[id] = {deletedAt: Date.now()};
        } else {
            const update = Object.fromEntries(
                Object.entries(VALID_KEYS)
                .map(([k]) => [k, value[k]])
                .filter(([_, v]) => v !== undefined)
            );
            update.path = key;
            update.deletedAt = false;

            // If the value doesn't have an ID, generate a new document ID for it
            let id = value.id;
            if (!id || typeof id !== "string") {
                update.owner = this.#user;
                id = doc(this.#collection).id;
                this._get(path).id = id; // Update the FStats instance with the new ID
                this.#writeSet[id] = update;
            } else {
                this.#changedKeySet[id] = update;
            }
        }

        if (!this.#changedKeySetTimeout) {
            this.#changedKeySetTimeout = true;
            window.requestAnimationFrame(() => {
                let changedKeySet = this.#changedKeySet;
                let writeSet = this.#writeSet;
                this.#writeSet = {};
                this.#changedKeySet = {};
                this.#changedKeySetTimeout = false;
                console.log(writeSet);
                const batch = writeBatch(db);
                for (const id in changedKeySet) {
                    const data = changedKeySet[id];
                    this.#pushDocUpdate(id, data, batch);
                    // console.log("Updating document:", id, JSON.stringify(data));
                }
                for (const id in writeSet) {
                    const data = writeSet[id];
                    this.#pushDocSet(id, data, batch);
                    // console.log("Creating document:", id, JSON.stringify(data));
                }
                let c = async () => {
                    try {
                        await batch.commit();
                    } catch (error) {
                        console.warn("Error committing batch:", error);
                    }
                }
                c();
            })
        }
    }

    #updateDoc(doc, removed = false, triggerUpdate = true) {
        let data = doc.data();
        if (!data || !data.path || typeof data.path !== "string") {
            return;
        }

        const key = data.path;
        const path = key2path(data.path);

        const oldValue = this._get(path);
        if (oldValue && oldValue.id !== doc.id) {
            console.warn(`Document ID mismatch for path "${path}" this may indicate two documents with the same path.`);
        } else {
            this.#key2docID[key] = doc.id;
    
            if (removed) {
                data = null;
            } else {
                delete data.path;
                delete data.owner;
                data.id = doc.id;
            }
    
            let change = super._set(path, data);
            if (change && triggerUpdate) {
                this._onUpdate();
                if (!this.#commitHistoryTimeout) {
                    this.#commitHistoryTimeout = setTimeout(() => {
                        this._commitHistory();
                        this.#commitHistoryTimeout = null;
                    }, this.#commitHistoryDelay);
                }
            }
        }
    }
    

    async watch() {
        const watchPromise = async () => {
            const q = query(this.#collection, where("owner", "==", this.#user), where("deletedAt", "==", false));
            try {
                const initialSnapshot = await getDocs(q);
                for (const doc of initialSnapshot.docs) {
                    this.#updateDoc(doc, false, false);
                }
                this._onUpdate();
                this._discardCurrentHistory();
                
                this.#unsubscribe = onSnapshot(q, (snapshot) => {
                    // console.log("Firestore snapshot received:", snapshot);
                    snapshot.docChanges().forEach((change) => {
                        this.#updateDoc(change.doc, change.type === "removed");
                    });
                });
            } catch (error) {
                console.warn("Error watching Firestore collection:", error);
            }
        }
        if (this.#watchPromise) {
            await this.#watchPromise;
        } else {
            this.#watchPromise = watchPromise();
        }
    }
    
    stopWatch() {
        this.#unsubscribe && this.#unsubscribe();
        this.#watchPromise = null;
    }

}
