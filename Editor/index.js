import * as FB from "../src/Firebase/firebase.js";


let userLoadedPromise = FB.initialise();

import { OpenBoardEditor } from "../src/Editor/editor.js";
import { BoardWatcher } from "../src/Firebase/boards.js";

let styleSheetsLoader = await OpenBoardEditor.loadStyleSheets()
OpenBoardEditor.defineHTMLElement(OpenBoardEditor);
const editor = document.querySelector("open-board-editor");

/** @type {BoardWatcher } */
let boardWatcher = null;


let updateTimeout = null;
async function editBoard(boardID) {
    if (boardWatcher) {
        if (updateTimeout) {
            clearTimeout(updateTimeout);
            updateTimeout = null;
        }
        boardWatcher.stop();
        boardWatcher = null;
    }

    let canSave = false;
    let canSaveDraft = false;
    function updateSaveStatus() {
        const editorBoard = editor.board;
        const draftBoard = boardWatcher?.draft;
        const savedBoard = boardWatcher?.board;

        let newCanSave = !editorBoard.same(savedBoard);
        let change = newCanSave !== canSave;
        canSave = newCanSave;
        canSaveDraft = !editorBoard.same(draftBoard);
        console.log(`update status: canSave=${canSave}, canSaveDraft=${canSaveDraft}`)
		editor.titleNote.innerHTML = canSaveDraft ? "*" : "&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;Draft Saved"
        if (change) {
            editor.forceUpdate();
        }
    }

    function updateTitle() {
        let path = boardWatcher?.metadata.path;
		path = path ? "&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;<b>" + path.replace(/\\/g, " ▸ ") + "<b/>" : "";
		editor.titleSpan.innerHTML = "Squidly Board Editor" + path;
    }

    editor.getIsSaveable = () => {
        return canSave;
    }

    editor.onUpdate = (board) => {
        updateSaveStatus();

        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }
        updateTimeout = setTimeout(() => {
            if (boardWatcher && canSaveDraft && !editor.editingLabel) {
                boardWatcher.updateDraft(board);
            }
        }, 10000);
    }

    let started = false;
    boardWatcher = new BoardWatcher(boardID, () => {
        const { currentBoard, board, metadata, draft } = boardWatcher;
        if (!started) {
            started = true;
            editor.board = currentBoard;
        } else {
            editor.updateBoard(currentBoard);
        }
        updateTitle();
        updateSaveStatus();
    });
    await boardWatcher.watch();

    editor.clearChanges = () => {
        editor.updateBoard(boardWatcher.board);
    }
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
