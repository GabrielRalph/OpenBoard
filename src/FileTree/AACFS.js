import { AACBoard, AACGrid } from "../AACWebComponent/aac.js";
import { ShadowElement, SvgPlus } from "../Utilities/utils.js";
import { FBFileSystem } from "./FileSystem/FBFileSystem.js";
import { FirebaseFrame } from "../Firebase/firebase-frame.js";
import { Path, FStats } from "./FileSystem/FileSystem.js";
import { FileSystemUI, FSColumn, FSFileIcon } from "./FileSystem/FileSystemUI.js";
import * as FB from "../Firebase/firebase.js";
import { FStoreFileSystem } from "./FileSystem/FStoreFileSystem.js";
import { getBoard } from "./board-loader.js";


FB.addAuthChangeListener((user) => {
    if (user) {
        console.log("User logged in:", user.uid);
    } else {
        console.log("User logged out");
    }
});

FB.initialise();


class AACFStat extends FStats {
    #isDirectory = false;
    constructor(path, contents = null, fs) {
        super(path, contents, fs);
        this.#isDirectory = fs.readdir(path).length > 0;
    }

    get boardID() {
        return this.metadata && this.metadata.id;
    }

    get isDirectory() {
        return this.#isDirectory || super.isDirectory;
    }

    get isFavourite() {
        return this.contents && this.contents.favourite;
    }

    get isPublic() {
        return this.metadata && (this.metadata.public || this.metadata.effectivePublic);
    }

    get public() {
        return this.metadata && this.metadata.public;
    }

    asPublic(value) {
        const contents = this.contents || {};
        contents.public = value;
        return contents;
    }

    asFavourite(value) {
        const contents = this.contents || {};
        contents.favourite = value;
        return contents;
    }

    asEffectivePublic(value) {
        const contents = this.contents || {};
        contents.effectivePublic = value;
        return contents;
    }

    // set public(bool) {
    //     if (this.contents) {
    //         this.contents.public = bool;
    //     }
    // }

    // set favourite(bool) {
    //     if (this.contents) {
    //         this.contents.favourite = bool;
    //     }
    // }

    getEffectivePublic(fs) {
        let result = false;

        if (this.contents && this.contents.public) {
            result = true;
        } else if (this.path.length > 1) {
            let parentPath = this.path.parent;
            let stat = fs.stat(parentPath);
            if (stat) {
                result = stat.getEffectivePublic(fs);
            }
        }
        
        return result;
    }

    /**
     * @returns {boolean} returns true if the file is an AAC board, false otherwise.
     */
    get isBoard() {
        // console.log("AACFStat isBoard", this.contents, this.contents && this.contents.boardID);
        return this.metadata && !this.metadata.isDirectory;
    }
}

/**
 * @classdesc A file system that interacts with Firebase Realtime Database and is tailored for AAC (Augmentative and Alternative Communication) boards.
 * @extends {FBFileSystem<AACFStat>}
 * @class
 */
class AACFileSystem extends FStoreFileSystem {
    constructor(user) {
        super(user, "boards", AACFStat);
    }

    getMoveExecuter(oldPath, newPath) {
        let result = super.getMoveExecuter(oldPath, newPath);
        if (result.changed) {
            let oldExecuter = result.execute;
            result.execute = async() => {
                oldExecuter();
                this.#downPropagateEffectivePublic(newPath);
                this._mergeWithLastHistory();
            }
        }
        return result;
    }


    favourite(path, bool = true) {
        path = path instanceof Path ? path : new Path(path);
        let fstat = this.stat(path);
        if (fstat.isBoard) {
            this._set(path, fstat.asFavourite(bool));

            if (fstat.public && !bool) {
                this.#makePublic(path, false);
            } 

            this._commitHistory();
            this._onUpdate();
        }
    }

    #downPropagateEffectivePublic(path) {
        path = path instanceof Path ? path : new Path(path);
        

        let stat = this.stat(path);
        let initBool = stat.getEffectivePublic(this);
        if (stat.isBoard) {
            this._set(path, stat.asEffectivePublic(initBool));
        }

        let recurse = (path, bool) => {
            let files = this.readdir(path);
            for (let file of files) {
                let newBool = bool;
                if (file.isBoard) {
                    newBool = !!(bool || file.public);
                    this._set(file.path, file.asEffectivePublic(newBool));
                }
                recurse(file.path, newBool);
            }
        }
        recurse(path, initBool);
    }

    makePublic(path, bool = true) {
        if (this.#makePublic(path, bool)) {
            this._commitHistory();
            this._onUpdate();
        }
    }

    #makePublic(path, bool = true) {
        let t1 = performance.now();
        path = path instanceof Path ? path : new Path(path);
        let tx = performance.now();
        let fstat = this.stat(path);
        let dx = performance.now() - tx;
        if (fstat.isBoard) {
            const newContents = fstat.asPublic(bool);
            if (!fstat.isFavourite && bool) {
                newContents.favourite = true;
            }
            // set board public status
            this._set(path, newContents);
            
            // update effective public status for this board and its children
            this.#downPropagateEffectivePublic(path); 
        }
        return fstat.isBoard;
    }

    isDirectory(){return true;}
}


class AACFSColumn extends FSColumn {
    constructor(...args) {
        super(...args);
    }
    onContextMenu(event, root, fstat) {
        // console.log("AACFSColumn onContextMenu", fstat.path.toString(), root.isPathSelected(fstat.path));
        root.addContextMenu(
            [
                {
                    label: "New Folder",
                    icon: "<i-bw new-folder></i-bw>",
                    action: () => {root.newFolder(fstat.path)}
                },
                "seperator",
                ...(fstat.isBoard ? [
                    fstat.isFavourite ?  {
                        label: "Unfavourite",
                        icon: "<i-c not-favourite></i-c>",
                        action: () => {root.favourite(fstat.path, false)},
                        binding: "F"
                    } : {
                        label: "Favourite",
                        icon: "<i-c favourite></i-c>",
                        action: () => {root.favourite(fstat.path, true)},
                        binding: "F"
                    },
                    fstat.public ? {
                        label: "Make Private",
                        icon: "<i-c not-favourite-public></i-c>",
                        action: () => {root.makePublic(fstat.path, false)},
                        binding: "P"
                    } : {
                        label: "Make Public",
                        icon: "<i-c favourite-public></i-c>",
                        action: () => {root.makePublic(fstat.path, true)},
                        binding: "P"
                    },
                    "seperator"
                ]: []),
                // TODO
                // {
                //     label: "Copy",
                //     icon: "<i-bw copy></i-bw>",
                //     binding: "⌘C"
                // },
                // {
                //     label: "Paste",
                //     icon: "<i-bw paste></i-bw>",
                //     binding: "⌘V"
                // },
                {
                    label: "Delete",
                    icon: "<i-bw trash></i-bw>",
                    binding: "<i-bw delete-key></i-bw>",
                    action: () => root.delete(fstat.path)
                },
                {
                    label: "Rename",
                    icon: "<i-bw edit></i-bw>",
                    binding: "⌘R",
                    action: () => root.promtRename(fstat.path)
                }
            ], event
        );
        return true;
    }
}

class AACFSFileIcon extends FSFileIcon {
    /**
     * @param {FStats} fstat
     * @param {AACFileSystemUI} root
     */
    constructor(fstat, root) {
        super(fstat, root);

        let iconArea = this.createChild("div");
        if (fstat.isPublic && !fstat.isFavourite) {
            iconArea.createChild("i-circ", {"name": "Public"});
        } else if (fstat.isPublic || fstat.isFavourite) {
            iconArea.createChild("fs-i", {[fstat.isPublic ? "favourite-public" : "favourite"]: ""});
        }
        if (fstat.isDirectory && fstat.isBoard) {
            iconArea.createChild("fs-i", {"f-grid": ""});
        } else if (fstat.isDirectory) iconArea.createChild("fs-i")
        else iconArea.createChild("fs-i", {grid: ""});

        this.createChild("span", {innerHTML: fstat.path.name});
        if (fstat.isDirectory) this.createChild("fs-i", {"right-arrow": ""});
    }

    onContextMenu(event, root, fstat) {
        root.addContextMenu(
            [
                {
                    label: "New Folder",
                    icon: "<i-bw new-folder></i-bw>",
                    action: () => {root.newFolder(fstat.path)}
                },
                "seperator",
                ...(fstat.isBoard ? [
                    fstat.isFavourite ?  {
                        label: "Unfavourite",
                        icon: "<i-c not-favourite></i-c>",
                        action: () => {root.favourite(fstat.path, false)},
                        binding: "F"
                    } : {
                        label: "Favourite",
                        icon: "<i-c favourite></i-c>",
                        action: () => {root.favourite(fstat.path, true)},
                        binding: "F"
                    },
                    fstat.public ? {
                        label: "Make Private",
                        icon: "<i-c not-favourite-public></i-c>",
                        action: () => {root.makePublic(fstat.path, false)},
                        binding: "P"
                    } : {
                        label: "Make Public",
                        icon: "<i-c favourite-public></i-c>",
                        action: () => {root.makePublic(fstat.path, true)},
                        binding: "P"
                    },
                    "seperator"
                ]: []),
                // TODO
                // {
                //     label: "Copy",
                //     icon: "<i-bw copy></i-bw>",
                //     binding: "⌘C"
                // },
                // {
                //     label: "Paste",
                //     icon: "<i-bw paste></i-bw>",
                //     binding: "⌘V"
                // },
                {
                    label: "Delete",
                    icon: "<i-bw trash></i-bw>",
                    binding: "<i-bw delete-key></i-bw>",
                    action: () => root.delete(fstat.path)
                },
                {
                    label: "Rename",
                    icon: "<i-bw edit></i-bw>",
                    binding: "⌘R",
                    action: () => root.promtRename(fstat.path)
                }
            ], event
        );
        return true;
    }
}


class AACGridWrapper extends SvgPlus {
    constructor(fstat, root) {
        super("fs-file-display");
        this.class = "aac-grid-wrapper";
        
        let resizeObserver = new ResizeObserver(() => {
            this.styles = {
                "--width": `${this.clientWidth}px`,
            }
        });
        resizeObserver.observe(this);

        if (fstat.isBoard) {
            this.loadBoard(fstat.boardID, root);
        }
    }

    async loadBoard(id, root) {
        if (this._loadedBoardID === id) return;
        this._loadedBoardID = id;
        const board = await getBoard(id, null, (board) => {
            console.log("opened board", board)
            this.innerHTML = "";
            let a = this.createChild(AACGrid, {}, board);
            a.addEventListener("aac-click", e => {
                let button = e.button;
                if (button.load_board) {
                    let id = button.load_board.id;
                    let files = root.fs.searchFiles(f => f.id === id);
                    if (files.length > 0) {
                        root.select(new Path(files[0].path));
                    }
                }
            })
        });
    }
}


class AACFileSystemUI extends FileSystemUI {
    /** @type {AACFileSystem} */
    fs = null;

    constructor(root) {
        super(AACFSFileIcon, AACGridWrapper, AACFSColumn);
        const fs = new AACFileSystem(root);
        this.setRoot(fs, "");
        fs.watch();

        window.addEventListener("keydown", e => {
            let keyCombo = e.metaKey ? "⌘" : "";
            keyCombo += e.key.toUpperCase();
            if (keyCombo in this.KEY_BINDINGS) {
                this.KEY_BINDINGS[keyCombo](e);
            }
        })
    }

    KEY_BINDINGS = {
        "F": e => {
            if (this.fs && this.selection.length > 0) {
                for (let path of this.selection) {
                    let stat = this.fs.stat(path);
                    if (stat.isBoard) {
                        this.favourite(path, !stat.isFavourite);
                    }
                }
            }
        },
        "P": e => {
             if (this.fs && this.selection.length > 0) {
                for (let path of this.selection) {
                    let stat = this.fs.stat(path);
                    if (stat.isBoard) {
                        this.makePublic(path, !stat.isPublic);
                    }
                }
            }
        },
        "⌘R": e => {
            if (this.fs && this.isSingleSelection && this.selected) {
                this.promtRename(this.selected);
                e.preventDefault();
            }
        },
        "⌘Z": e => {
            if (this.fs) {
                this.fs.undo();
            }
        },
        "⌘Y": e => {
            if (this.fs) {
                this.fs.redo();
            }
        }
    }

    isRootBoardSet(fstat) {
        if (this.fs) {
            return this.fs.isRootBoardSet(fstat.path);
        }
        return false;
    }

    favourite(path, bool) {
        if (this.fs) {
            this.fs.favourite(path, bool);
        }
    }

    makePublic(path, bool) {
        if (this.fs) {
            this.fs.makePublic(path, bool);
        }
    }

    select(...args) {
        super.select(...args);

        let files = this.fs.readdir(this.selected);
        for (let file of files) {
            if (file.isBoard) {
                getBoard(file.boardID, file.metadata.lastUpdated)
            }
        }
    }
}

export class AACFinder extends ShadowElement {
    constructor(el = "aac-finder") {
        super(el, "div");
    }

    setFirebasePath(path) {
        this.root.innerHTML = "";
        this.createChild(AACFileSystemUI, {}, path);
    }

    static get usedStyleSheets() {
        return [
            ...AACBoard.usedStyleSheets,
            import.meta.resolve("./style.css"),
            import.meta.resolve("../Assets/icons.css"),
        ]
    }
}

// export { AACFileSystem, AACFileSystemUI, AACFStat, FSFile, AACGridWrapper };