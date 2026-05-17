import "./AACWebComponent/aac.js";
import { OBBoardManager } from "./openboard.js";
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

export async function setup(url) {
    manager = await OBBoardManager.load(url, (p) => {
        console.log(`Loading board set: ${Math.round(p * 100)}%`);
        document.body.style.setProperty("--p", p);
    });
    aacBoard.manager = manager;
    aacBoard 

    window.SquidlyAPI.firebaseOnValue("value1", value => {
        if (value) {
            aacBoard.state = JSON.parse(value);
        }
    });
    document.body.toggleAttribute("loaded", true);    
}

// export const BOARDS = {
//   "CommuniKate20": {
//     "name": "CommuniKate 20",
//     "licence": "CC-By NC-SA by Kate McCallum",
//     "icon": "/previews/communikate-20.png",
//     "url": "https://openboards.s3.amazonaws.com/examples/communikate-20.obz"
//   },
//   "CommuniKate12": {
//     "name": "CommuniKate 12",
//     "licence": "CC-By NC-SA by Kate McCallum",
//     "icon": "/previews/communikate-12.png",
//     "url": "https://openboards.s3.amazonaws.com/examples/ck12.obz"
//   },
//   "ProjectCore": {
//     "name": "Project Core",
//     "licence": "CC-By by UNC Chapel Hill",
//     "icon": "/previews/project-core.png"
//   },
//   "QuickCore24": {
//     "name": "Quick Core 24",
//     "licence": "CC-By by OpenAAC",
//     "icon": "https://www.openaac.org/images/2024/quick-core-24.png",
//     "url": "https://openboards.s3.amazonaws.com/examples/quick-core-24.obz"
//   },
//   "QuickCore40": {
//     "name": "Quick Core 40",
//     "licence": "CC-By by OpenAAC",
//     "icon": "https://www.openaac.org/images/2024/quick-core-40.png",
//     "url": "https://openboards.s3.amazonaws.com/examples/quick-core-40.obz"
//   },
//   "QuickCore60": {
//     "name": "Quick Core 60",
//     "licence": "CC-By by OpenAAC",
//     "icon": "https://www.openaac.org/images/2024/quick-core-60.png",
//     "url": "https://openboards.s3.amazonaws.com/examples/quick-core-60.obz"
//   },
//   "QuickCore84": {
//     "name": "Quick Core 84",
//     "licence": "CC-By by OpenAAC",
//     "icon": "https://www.openaac.org/images/2024/quick-core-84.png",
//     "url": "https://openboards.s3.amazonaws.com/examples/quick-core-84.obz"
//   },
//   "QuickCore112": {
//     "name": "Quick Core 112",
//     "licence": "CC-By by OpenAAC",
//     "icon": "https://www.openaac.org/images/2024/quick-core-112.png",
//     "url": "https://openboards.s3.amazonaws.com/examples/quick-core-112.obz"
//   },
//   "VocalFlair24": {
//     "name": "Vocal Flair 24",
//     "licence": "CC-By by OpenAAC",
//     "icon": "https://www.openaac.org/images/2024/vocal-flair-24.png",
//     "url": "https://openboards.s3.amazonaws.com/examples/vocal-flair-24.obz"
//   },
//   "VocalFlair40": {
//     "name": "Vocal Flair 40",
//     "licence": "CC-By by OpenAAC",
//     "icon": "https://www.openaac.org/images/2024/vocal-flair-40.png",
//     "url": "https://openboards.s3.amazonaws.com/examples/vocal-flair-40.obz"
//   },
//   "VocalFlair60": {
//     "name": "Vocal Flair 60",
//     "licence": "CC-By by OpenAAC",
//     "icon": "https://www.openaac.org/images/2024/vocal-flair-60.png",
//     "url": "https://openboards.s3.amazonaws.com/examples/vocal-flair-60.obz"
//   },
//   "VocalFlair84": {
//     "name": "Vocal Flair 84",
//     "licence": "CC-By by OpenAAC",
//     "icon": "https://www.openaac.org/images/2024/vocal-flair-84.png",
//     "url": "https://openboards.s3.amazonaws.com/examples/vocal-flair-84.obz"
//   },
//   "VocalFlair84-WithKeyboard": {
//     "name": "Vocal Flair 84 - With Keyboard",
//     "licence": "CC-By by OpenAAC",
//     "icon": "https://www.openaac.org/images/2024/vocal-flair-84.png",
//     "url": "https://openboards.s3.amazonaws.com/examples/vocal-flair-84-with-keyboard.obz"
//   },
//   "VocalFlair112": {
//     "name": "Vocal Flair 112",
//     "licence": "CC-By by OpenAAC",
//     "icon": "https://www.openaac.org/images/2024/vocal-flair-112.png",
//     "url": "https://openboards.s3.amazonaws.com/examples/vocal-flair-112.obz"
//   },
//   "Sequia15": {
//     "name": "Sequia 15",
//     "licence": "CC-By by OpenAAC",
//     "icon": "https://www.openaac.org/images/2024/sequoia-15.png",
//     "url": "https://openboards.s3.amazonaws.com/examples/sequoia-15.obz"
//   },
//   "U28": {
//     "name": "Unity 28",
//     "licence": "CC-By by Gabriel Ralph",
//     "icon": "https://www.openaac.org/images/2024/u28.png",
//     "url": "../U28.obz"
//   }
// }


