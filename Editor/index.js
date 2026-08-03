import * as FB from "../src/Firebase/firebase.js";


let userLoadedPromise = FB.initialise();

import { OpenBoardEditor } from "../src/Editor/editor.js";
import { BoardWatcher } from "../src/Firebase/boards.js";

let styleSheetsLoader = await OpenBoardEditor.loadStyleSheets()
OpenBoardEditor.defineHTMLElement(OpenBoardEditor);
const editor = document.querySelector("open-board-editor");

let boardWatcher = null;
async function editBoard(boardID) {
    if (boardWatcher) {
        boardWatcher.stop();
        boardWatcher = null;
    }

    boardWatcher = new BoardWatcher(boardID, (state) => {
        console.log("Board state changed", state);
        const { board, metadata, isDraft } = state;
        if (board) {
            editor.metadata = metadata;
            editor.isDraftVersion = isDraft;
            editor.board = board;
        }
    });
    await boardWatcher.start();
}

async function onUserChange(user) {
    document.body.toggleAttribute("loading", true);
    if (user) {
        console.log("User is logged in:", user.uid);
        const query = new URLSearchParams(window.location.search);
        const boardID = query.get("board");

        if (boardID) {
            console.log("Editing board:", boardID);
            await Promise.all([ editBoard(boardID), styleSheetsLoader]);
            console.log("Loaded board", boardID);
        }
    } else {
        // Display a message or redirect to login page
        console.log("User is not logged in. Please log in to access the editor.");
    }
    document.body.toggleAttribute("loading", false);
    console.log("Loaded");
}

await userLoadedPromise;
FB.addAuthChangeListener(onUserChange);
