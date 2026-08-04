import { OBFileSystem, OBFStat } from "../src/FileTree/OBFileSystem.js";
import { OBFinder } from "../src/FileTree/OBFinder.js";
import { OBLoadBoard } from "../src/OpenBoard/openboard.js";
import { ShadowElement } from "../src/Utilities/utils.js";
import { initialise, addAuthChangeListener } from "../src/Firebase/firebase.js";

export class AACFinder extends ShadowElement {
    /** @type {OBFileSystem} */
    #fs = null;
    #loading = null;
    #lastSelected = null;
	constructor(el) {
		super(el, "board-finder");
		this.fsUI = this.createChild(OBFinder)
	}

	onconnect() {
		console.log("AACFinder connected")
	}

    async assignUser(uid) {
		this.#fs = new OBFileSystem(uid)
		this.#loading = this.#fs.watch();
        await this.#loading;
        this.#loading = null;
        console.log("loaded fs", this.#fs)
		this.fsUI.setRoot(this.#fs, "", "")
	}
	
	static get usedStyleSheets() {
		return [
			...OBFinder.usedStyleSheets,
		]
	}
}


await initialise();
AACFinder.defineHTMLElement(AACFinder, "aac-finder");
const finder = document.querySelector("aac-finder");
finder.assignUser("squidly");

