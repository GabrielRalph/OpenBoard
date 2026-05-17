import { OBBoardManager, loadFile } from "./openboard-node.js";
import fs from 'fs/promises';

// const BOARDS = {
//   "CommuniKate20": {
//     "name": "CommuniKate 20",
//     "licence": "CC-By NC-SA by Kate McCallum",
//     "icon": "https://www.openboardformat.org/previews/communikate-20.png",
//     "url": "https://openboards.s3.amazonaws.com/examples/communikate-20.obz"
//   },
//   "CommuniKate12": {
//     "name": "CommuniKate 12",
//     "licence": "CC-By NC-SA by Kate McCallum",
//     "icon": "https://www.openboardformat.org/previews/communikate-12.png",
//     "url": "https://openboards.s3.amazonaws.com/examples/ck12.obz"
//   },
//   "ProjectCore": {
//     "name": "Project Core",
//     "licence": "CC-By by UNC Chapel Hill",
//     "icon": "https://www.openboardformat.org/previews/project-core.png",
//     "url": "https://openboards.s3.amazonaws.com/examples/project-core.obf"
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
const BOARDS2 = {
  "CommuniKate20": {
    "name": "CommuniKate 20",
    "licence": "CC-By NC-SA by Kate McCallum",
    "icon": "/previews/communikate-20.png",
    "url": "https://openboards.s3.amazonaws.com/examples/communikate-20.obz",
    "description": "CommuniKate 20 is a functional communication board with 20 buttons per board created by Kate McCallum for the adult population of communicators that she serves."
  },
  "CommuniKate12": {
    "name": "CommuniKate 12",
    "licence": "CC-By NC-SA by Kate McCallum",
    "icon": "/previews/communikate-12.png",
    "url": "https://openboards.s3.amazonaws.com/examples/ck12.obz",
    "description": "CommuniKate 12 is a smaller version of CommuniKate 20, it has only 12 buttons per board but offers the same style of layout and functional style of communication."
  },
//   "ProjectCore": {
//     "name": "Project Core",
//     "licence": "CC-By by UNC Chapel Hill",
//     "icon": "/previews/project-core.png",
//     "description": "Project core is a research-based initiative to ensure all communicators have at least one option for beginning core-base communication."
//   },
  "QuickCore24": {
    "name": "Quick Core 24",
    "licence": "CC-By by OpenAAC",
    "icon": "https://www.openaac.org/images/2024/quick-core-24.png",
    "url": "https://openboards.s3.amazonaws.com/examples/quick-core-24.obz",
    "description": "Quick Core 24 is a core, motor-planning based vocabulary set with up to 24 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
  },
  "QuickCore40": {
    "name": "Quick Core 40",
    "licence": "CC-By by OpenAAC",
    "icon": "https://www.openaac.org/images/2024/quick-core-40.png",
    "url": "https://openboards.s3.amazonaws.com/examples/quick-core-40.obz",
    "description": "Quick Core 40 is a core, motor-planning based vocabulary set with up to 40 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
  },
  "QuickCore60": {
    "name": "Quick Core 60",
    "licence": "CC-By by OpenAAC",
    "icon": "https://www.openaac.org/images/2024/quick-core-60.png",
    "url": "https://openboards.s3.amazonaws.com/examples/quick-core-60.obz",
    "description": "Quick Core 60 is a core, motor-planning based vocabulary set with up to 60 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
  },
  "QuickCore84": {
    "name": "Quick Core 84",
    "licence": "CC-By by OpenAAC",
    "icon": "https://www.openaac.org/images/2024/quick-core-84.png",
    "url": "https://openboards.s3.amazonaws.com/examples/quick-core-84.obz",
    "description": "Quick Core 84 is a core, motor-planning based vocabulary set with up to 84 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
  },
  "QuickCore112": {
    "name": "Quick Core 112",
    "licence": "CC-By by OpenAAC",
    "icon": "https://www.openaac.org/images/2024/quick-core-112.png",
    "url": "https://openboards.s3.amazonaws.com/examples/quick-core-112.obz",
    "description": "Quick Core 112 is a core, motor-planning based vocabulary set with up to 112 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
  },
  "VocalFlair24": {
    "name": "Vocal Flair 24",
    "licence": "CC-By by OpenAAC",
    "icon": "https://www.openaac.org/images/2024/vocal-flair-24.png",
    "url": "https://openboards.s3.amazonaws.com/examples/vocal-flair-24.obz",
    "description": "Vocal Flair 24 is a core, flat-but-dynamic-styled vocabulary set with up to 24 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
  },
  "VocalFlair40": {
    "name": "Vocal Flair 40",
    "licence": "CC-By by OpenAAC",
    "icon": "https://www.openaac.org/images/2024/vocal-flair-40.png",
    "url": "https://openboards.s3.amazonaws.com/examples/vocal-flair-40.obz",
    "description": "Vocal Flair 40 is a core, flat-but-dynamic-styled vocabulary set with up to 40 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
  },
  "VocalFlair60": {
    "name": "Vocal Flair 60",
    "licence": "CC-By by OpenAAC",
    "icon": "https://www.openaac.org/images/2024/vocal-flair-60.png",
    "url": "https://openboards.s3.amazonaws.com/examples/vocal-flair-60.obz",
    "description": "Vocal Flair 60 is a core, flat-but-dynamic-styled vocabulary set with up to 60 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
  },
  "VocalFlair84": {
    "name": "Vocal Flair 84",
    "licence": "CC-By by OpenAAC",
    "icon": "https://www.openaac.org/images/2024/vocal-flair-84.png",
    "url": "https://openboards.s3.amazonaws.com/examples/vocal-flair-84.obz",
    "description": "Vocal Flair 84 is a core, flat-but-dynamic-styled vocabulary set with up to 84 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
  },
  "VocalFlair84-WithKeyboard": {
    "name": "Vocal Flair 84 - With Keyboard",
    "licence": "CC-By by OpenAAC",
    "icon": "https://www.openaac.org/images/2024/vocal-flair-84.png",
    "url": "https://openboards.s3.amazonaws.com/examples/vocal-flair-84-with-keyboard.obz",
    "description": "Vocal Flair 84 is a core, flat-but-dynamic-styled vocabulary set with up to 84 buttons per board, including a keyboard on the main board. It has built-in progression to gradually expand the vocabulary over time."
  },
  "VocalFlair112": {
    "name": "Vocal Flair 112",
    "licence": "CC-By by OpenAAC",
    "icon": "https://www.openaac.org/images/2024/vocal-flair-112.png",
    "url": "https://openboards.s3.amazonaws.com/examples/vocal-flair-112.obz",
    "description": "Vocal Flair 112 is a core, flat-but-dynamic-styled vocabulary set with up to 112 buttons per board, including a keyboard on the main board. It has built-in progression to gradually expand the vocabulary over time."
  },
  "Sequia15": {
    "name": "Sequia 15",
    "licence": "CC-By by OpenAAC",
    "icon": "https://www.openaac.org/images/2024/sequoia-15.png",
    "url": "https://openboards.s3.amazonaws.com/examples/sequoia-15.obz",
    "description": "Sequoia-15 is a branching vocabulary set, built in an effort to support communication organized by pragmatic function but with the goal of encouraging expansion into generalized and core-oriented vocabulary."
  },
  "U28": {
    "name": "Unity 28",
    "description": "Unity 28 is a board set designed for users who are transitioning from single-word communication to more complex sentences.",
    "licence": "CC-By by Gabriel Ralph",
    "icon": "./u28.svg",
    // "url": "./U28.obz"
  }
}

const template = await fs.readFile("./index.html", "utf-8");

for (const [key, board] of Object.entries(BOARDS2)) {
    // console.log("Copying " + key);
    // let flag = await copyBoards("./BoardFiles/OpenBoardExamples/" + key + ".obz", key);
    // console.log("images need copying: " + flag);
    const boardFileExists = await fs.access("./BoardFiles/" + key + ".obz").then(() => true).catch(() => false); 
    if (boardFileExists) {

        const dir = "./BoardApps/" + key;
        await fs.mkdir(dir, { recursive: true });

        const InfoJSON = {
            "name": board.name,
            "title": board.name,
            "subtitle": board.name,
            "version": "1",
            "description": board.description,
            "author": board.licence,
            "icon": board.icon
        }
        await fs.writeFile(dir + "/info.json", JSON.stringify(InfoJSON, null, 2));
        board.url = "../../BoardFiles/" + key + ".obz";
        const indexHTML = template.replace(/\${{(\w+)}}/g, (_,a) => board[a] || "");
        await fs.writeFile(dir + "/index.html", indexHTML);
    }

}