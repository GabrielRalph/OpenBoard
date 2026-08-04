import * as FB from "./firebase.js";
import { OBBoard, OBBoardManager } from "../openboard.js";
import { FirestoreFrame } from "./firestore-frame.js";

const BOARD_CACHE = {};
const BOARD_LISTENERS = {}
const BOARD_META_CACHE = {};
const META = new FirestoreFrame("boards");
const DRAFTS = new FirestoreFrame("draft-boards");


function isNewer(a, b) {
    if (a.seconds > b.seconds) {
        return true
    } else if (a.seconds < b.seconds) {
        return false;
    } else {
        if (a.nanoseconds > b.nanoseconds) {
            return true;
        } else {
            return false;
        }
    }
}

/**
 * @param {string} id
 * 
 * @returns {Promise<OBBoard>}
 */
async function _loadBoard(id) {
    let board = null;
    if (id.startsWith("http")) {
        const response = await fetch(id);
        const text = await response.text();
        board = OBBoard.make(JSON.parse(text));
    } else {
        const blob = await FB.getFile(`boards/${id}`);
        const text = await blob.text();
        board = OBBoard.make(JSON.parse(text));
    }
    return board;
}

async function _getSquidlyBoard(id) {
    if (!(id in BOARD_LISTENERS)) {
        try {
            BOARD_LISTENERS[id] = await META.onValuePromise(id, async (data) => {
                BOARD_META_CACHE[id] = data;
            });
        } catch (e) {
            console.warn(`Error listening to board ${id}:`, e);
        }
    }

    let board = null;
    if (!BOARD_META_CACHE[id]) {
        // The doesn't board exists
        console.warn(`Board ${id} does not exist`);
    } else if (BOARD_META_CACHE[id].updatedAt == null) {
        // Board has not been created yet
        console.warn(`Board ${id} has not been created yet`);
    } else {
        // If the board is not in the cache, or if the board has 
        // been updated since it was last cached, load it from the server
        if (!(id in BOARD_CACHE) || isNewer(
            BOARD_META_CACHE[id].updatedAt, 
            BOARD_CACHE[id].lastUpdated)
        ) {
            BOARD_CACHE[id] = {
                board: _loadBoard(id), 
                lastUpdated: BOARD_META_CACHE[id].updatedAt
            };
        }
        board = await BOARD_CACHE[id].board;
    }
    return board;
}


/**
 * @param {string} id
 * 
 * @returns {Promise<OBBoard>}
 */
async function getBoard(id) {
    if (id.startsWith("http")) {
        return await _loadBoard(id);
    } else {
        return await _getSquidlyBoard(id);
    }
}

async function downloadBoardSet(rootID) {
    let manager = {
        boards: {},
        manifest: {
            root: rootID,
            paths: {}
        }
    }

    let rec = async (ids) => {
        ids = ids.filter(id => !(id in manager.boards))
        let boards = await Promise.all(ids.map(async id => {
            manager.boards[id] = true;
            const board = await getBoard(id, Date.now())
            console.log("downloaded board", id, board)
            manager.boards[id] = board
            let linkedBoards = board.linkedBoards.map(b => {
                let id = b.data_url || b.id;
                return id;
            })
            await rec(linkedBoards)
        }))
    }

    await rec([rootID])

    manager.manifest.paths.boards = Object.fromEntries(Object.entries(manager.boards).map(([id, board]) => [id, id]));

    return OBBoardManager.make(manager)
}

const DRAFT_VERSION_CACHE = {};

class BoardWatcher {
    board = null;
    exists = false;
    version = 0;
    metadata = null;
    callback = null;

    #initalised = false;

    #id = null;
    #enders = [];
    constructor(id, callback) {
        if (id.startsWith("http")) {
            throw new Error("Drafts cannot be watched from URL");
        }
        this.#id = id;
        this.callback = callback;
    }

    log(...args) {
        console.log(`%cBW-[${this.id.slice(-5)}]`, "background: black; color: orange; padding: 5px; border-radius: 5px;", ...args);
    }

    stop() {
        this.#enders.forEach(end => end());
    }

    async watch() {
        this.log("Starting watch");
        this.#enders = (await Promise.all([
            DRAFTS.onValuePromise(this.id, (data) => {
                this.draft = null;
                if (data) {
                    try {
                        this.draft = OBBoard.make(JSON.parse(data.board));
                    } catch (e) {
                        console.error("Error parsing draft board data", e);
                    }
                    this.version = data.version;
                }
                this.call();
            }),
            META.onValuePromise(this.id, async (data) => {
                this.log("Meta data changed");
                if (data) {
                    // Implement logic to handle if the board file has been 
                    // updated since the last time it was loaded
                    this.metadata = data;
                    this.exists = true;
                } else {
                    this.exists = false;
                }     
                this.call();
            }),
            this.#getBoardFile()
        ])).slice(0, 2);

        if (!this.exists) {
            throw new Error("Board does not exist");
        }
        this.#initalised = true;
        this.call();
    }

    async #getBoardFile() {
        let board = await getBoard(this.id)
        this.board = board || OBBoard.makeEmptyBoard(4, 5, this.id);
        this.log("Board file loaded", board);
    }


    async save(data) {
        await this.updateDraft(data);
        FB.callFunction('')
    }

    async updateDraft(data) {
        let update = {
            board: JSON.stringify(OBBoard.make(data)),
            version: (this.version || 0) + 1
        }
        this.log("Updating draft");
        await DRAFTS.set(this.id, update);
    }
  
    call() { 
        if (this.#initalised && this.callback instanceof Function) {
            this.callback();
        }
    }

    get currentBoard() {
        if (this.draft) {
            return this.draft;
        } else if (this.board) {
            return this.board;
        } else {
            return OBBoard.makeEmptyBoard(4, 5, this.id);
        }
    }

    get id() {
        return this.#id;
    }

}

export { getBoard, downloadBoardSet, BoardWatcher };