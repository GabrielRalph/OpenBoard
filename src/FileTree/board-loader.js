import * as FB from "../Firebase/firebase.js";
import { OBBoard } from "../src/utilites/openboard.js";

const BOARD_CACHE = {};

async function _loadBoard(id) {
    const blob = await FB.getFile(`boards/${id}`);
    const text = await blob.text();
    const board = OBBoard.make(JSON.parse(text));
    return board;
}

export async function getBoard(id, lastUpdated, onBoard = () => {}) {
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
