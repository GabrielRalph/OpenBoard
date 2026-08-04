import { AACBoard, AACGrid, AACGridWrapper } from "../src/AACWebComponent/aac.js";
import { BoardWatcher, downloadBoardSet, getBoard } from "../src/Firebase/boards.js";
import * as FB from "../src/Firebase/firebase.js";

FB.initialise();


async function setupBoard(rootID) {
    AACBoard.defineHTMLElement(AACBoard, "aac-board");

    let isSquidly = true;
    if (!window.SquidlyAPI) {
        window.SquidlyAPI = {
            firebaseOnValue: () => {},
            firebaseSet: () => {},
            speak: () => {},
            loadUtterances: () => {},
            setGridSize: () => {},
        }
        isSquidly = false;
    }

    /** @type {AACBoard} */
    const aacBoard = document.querySelector("aac-board");
    aacBoard.root.toggleAttribute("squidly", isSquidly);
    let manager;

    aacBoard.addEventListener("change", e => {
        // UPDATE STATE 
        window.SquidlyAPI.firebaseSet("value1", JSON.stringify(aacBoard.state));

        if (e.changes.indexOf("history") !== -1) {
            console.log("HISTORY CHANGED. CURRENT BOARD:", aacBoard.currentBoardID);
            let board = manager.getBoard(aacBoard.currentBoardID);

            const utterances = board.buttons.map(button => {
                return button.textInserted ? button.utterance : null;
            }).filter(utterance => utterance !== null)
            // Load utternaces
            window.SquidlyAPI.loadUtterances(utterances);

            window.SquidlyAPI.setGridSize(board.grid.rows+1, board.grid.columns);
        }
    });

    aacBoard.addEventListener("insert", e => {
        let utterance = e.button.utterance;
        window.SquidlyAPI.speak(utterance);
    });


    manager = await downloadBoardSet(rootID);
    aacBoard.manager = manager;
    window.SquidlyAPI.firebaseOnValue("value1", value => {
        if (value) {
            aacBoard.state = JSON.parse(value);
        }
    });
}

function setupPreview(rootID, isDraft) {
    document.body.toggleAttribute("preview", true);
    AACGridWrapper.defineHTMLElement(AACGridWrapper, "aac-board-preview");
    const aacBoard = document.querySelector("aac-board-preview");

    let LAST_BOARD_ID = null;
    let lastWatcher = null;
    async function setBoard(d) {
        if (d === LAST_BOARD_ID) return;
        LAST_BOARD_ID = d;
        document.body.toggleAttribute("loaded", false);  
        if (isDraft) {
            console.log("WATCHING BOARD", d)
            if (lastWatcher) {
                lastWatcher.stop();
                lastWatcher = null;
            }
            lastWatcher = new BoardWatcher(d, () => {
                const { board, draft } = lastWatcher;
                aacBoard.board = draft || board;
            });
            await lastWatcher.watch();
        } else {
            let board = await getBoard(d, Date.now());
            aacBoard.board = board;
        }


        document.body.toggleAttribute("loaded", true);  
    }

    setBoard(rootID);
    window.addEventListener("message", async (event) => {
        console.log("MESSAGE RECEIVED", event.data)
        if (event.data.type === "updateBoard") {
            await setBoard(event.data.id);
        }
    })
}


export async function setup() {

    let urlParams = new URLSearchParams(window.location.search);
    let rootID = urlParams.get("id")
    let mode = urlParams.get("mode") || "default";

    if (!rootID) {
        console.error("No root board ID provided in URL parameters. Please provide an 'id' parameter.");
        return;
    }

    if (mode === "default") {
        setupBoard(rootID);
    } else if (mode === "preview") {
        setupPreview(rootID, false);
    } else if (mode === "preview-draft") {
        setupPreview(rootID, true);
    }
    document.body.toggleAttribute("loaded", true);    
}

