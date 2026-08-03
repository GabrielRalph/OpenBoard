import * as FB from "./firebase.js";
import { OBBoard, OBBoardManager } from "../openboard.js";
import { FirestoreFrame } from "./firestore-frame.js";

const BOARD_CACHE = {};
const META = new FirestoreFrame("boards");
const DRAFTS = new FirestoreFrame("draft-boards");


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

/**
 * @param {string} id
 * @param {number} lastUpdated time stampe
 * @param {(board: OBBoard) => void} onBoard
 * 
 * @returns {Promise<OBBoard>}
 */
async function getBoard(id, lastUpdated, onBoard = () => {}) {
    let board = null;
    if (id in BOARD_CACHE) {
        if (typeof lastUpdated === "number" && BOARD_CACHE[id].lastUpdated < lastUpdated) {
            onBoard(BOARD_CACHE[id].board);
            board = await _loadBoard(id);
            BOARD_CACHE[id] = {board, lastUpdated};
            onBoard(board);
        } else {
            board = BOARD_CACHE[id].board;
            onBoard(board);
        }
    } else {
        board = await _loadBoard(id);
        lastUpdated = lastUpdated || Date.now();
        BOARD_CACHE[id] = {board, lastUpdated};
        onBoard(board);
    }
    return board;
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

    stop() {
        this.#enders.forEach(end => end());
    }

    async watch() {
        this.#enders = await Promise.all([
            DRAFTS.onValuePromise(id, async (data) => {
                this.draft = null;
                if (data) {
                    try {
                        this.draft = OBBoard.make(JSON.parse(data.board));
                    } catch (e) {
                        console.error("Error parsing draft board data", e);
                    }
                    this.version = data.version;
                }
                this.#call();
            }),
            META.onValuePromise(id, async (data) => {
                if (data) {
                    // Implement logic to handle if the board file has been 
                    // updated since the last time it was loaded
                    this.metadata = data;
                } else {
                    this.exists = false;
                }     
                this.#call();
            }),
            this.#getBoardFile()
        ]).slice(0, 2);

        if (!this.exists) {
            throw new Error("Board does not exist");
        }
        this.#initalised = true;
        this.#call();
    }

    async #getBoardFile() {
        let board = await getBoard(id, Date.now())
        this.board = board;
    }

    updateDraft(data) {
        await DRAFTS.set(this.id, {
            board: JSON.stringify(OBBoard.make(data)),
            version: (DRAFT_VERSION_CACHE[id] || 0) + 1
        });
    }
  
    #call() { 
        if (this.#initalised && this.callback instanceof Function) {
            this.callback();
        }
    }

    get id() {
        return this.#id;
    }

}

export { getBoard, downloadBoardSet, BoardWatcher };