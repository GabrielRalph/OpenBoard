import { OBBoard, OBButton, OBImage } from "../openboard.js";
import { AccessEvent, AccessTextArea, GridIcon, GridLayout, ShadowElement, SvgPlus } from "./utils.js";

function relTo(path, base = "https://session.squidly.com.au/main/") {
    let url = new URL("", import.meta.url).pathname.split("/");
    path = new URL(path).pathname.split("/");

    let i = 0;
    for (i = 0; i < path.length && path[i] == url[i]; i++);
    
    let relPath = path.slice(i).join("/");
    return new URL(relPath, base).href;
}

function rgbToHsl(r, g, b) {
  // 1. Normalize RGB values to the range [0, 1]
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  // 2. Calculate Saturation
  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    // 3. Calculate Hue
    switch (max) {
      case r: h = (g - b) / delta + (g < b ? 6 : 0); break;
      case g: h = (b - r) / delta + 2; break;
      case b: h = (r - g) / delta + 4; break;
    }
    h /= 6;
  }

  return [
    Math.round(h * 360),
    Math.round(s * 100),
    Math.round(l * 100)
  ]
}

/**
 * @param  {OBButton} button
 */
function colorGenerator(button) {
    const bg = button.background_color;
    const outline = button.outline_color;
    const text = button.text_color;
    let styles = {};

    if (typeof outline === "string") {
        styles["--outline"] = outline;
    }

    if (typeof text === "string") {
        styles["--text"] = text;
    } 

    if (typeof bg === "string") {
        styles["--main"] = bg;

        let match = bg.match(/rgba?\((\d+), ?(\d+), ?(\d+)(?:, ?([\d.]+))?\)/);
        
        if (match) {
            let r = parseInt(match[1]);
            let g = parseInt(match[2]);
            let b = parseInt(match[3]);
            let [h, s, l] = rgbToHsl(r, g, b);

            let L = 0.2126*r + 0.7152*g + 0.0722*b;

            if (typeof text !== "string") {
                styles["--text"] = L > 128 ? "black" : "white";
            }

            styles["--main-hover"] = `hsl(${h}, ${s * 1.2}%, ${l * 0.9}%)`;
            styles["--main-active"] = `hsl(${h}, ${s * 1.4}%, ${l * 0.8}%)`;
            styles["--tab-color"] = `hsl(${h}, ${s * 0.8}%, ${l * 0.6}%)`;
            styles["--tab-hover"] = `hsl(${h}, ${s * 0.8}%, ${l * 0.5}%)`;

            if (!styles["--outline"]) {
                if (s < 0.05) {
                    l *= 0.3;
                }
                styles["--outline"] = `hsl(${h}, ${s*1.5}%, ${l * 0.5}%)`;
            }

        }
        
    }
    return styles;
}

/**
 * @param {OBImage} image
 */
function resolveImagePath(image) {
    if (!image) return null;

    if (image.path) {
        return image.path;
    } else if (image.url) {
        return image.url;
    } else if (image.symbol) {
        const safe = image.symbol.path.split("/").map(encodeURIComponent).join("/");
        return "../IconSets/" + safe;
    }
}

class AACClick extends AccessEvent {
    constructor(e, button, element) {
        super("aac-click", e, {
            bubbles: true,
        });
        this.button = button;
        this.element = element;
    }
}

class AACChange extends AccessEvent {
    constructor(e, changes) {
        super("change", e, {
            bubbles: true,
        });
        this.changes = changes;
    }
}

class AACInsert extends AccessEvent {
    constructor(e, text) {
        super("insert", e, {
            bubbles: true,
        });
        this.text = text;
        this.button = e.button;
    }
}

class AACButton extends GridIcon {
    /**
     * @param {string} button_id
     * @param  {OBBoard} board
     */
    constructor(button_id, board) {
        const button = board.getButtonById(button_id);
        const image = board.getImageById(button.image_id);
        const symbol = resolveImagePath(image);
        super({
            displayValue: button.label,
            symbol: symbol,
            type: (button.load_board ? "topic-" : "") + "white",
            events: {
                "access-click": (e) => this.dispatchEvent(new AACClick(e, button, this))
            },
        });
        this.styles = colorGenerator(button);

        if (!symbol && button.label.length === 1) { 
            this.toggleAttribute("character-button", true);
        }
    }
}


class AACBoard extends ShadowElement {
    #history = [];
    #renderedBoardID = null;
    #boardCache = {};

    /** @type {GridLayout} */
    #grid = null;

    /** @type {GridLayout} */
    #rootGrid = null;

    #closeButton = null;
    #backspaceButton = null;

    /** @type {AccessTextArea} */
    #textArea = null;

    #board = null;
    #holdBoard = null;
    #manager = null;
    constructor(el) {
        super(el, "aac-board-contents");
        this.#rootGrid = this.createChild(GridLayout, {
            events: {"aac-click":  this.#onButtonClick.bind(this)}
        }, 2, 1);
        
        this.#closeButton = this.#rootGrid.addGridIcon({
            symbol: "home",
            type: "action",
            events: {"access-click": () => this.gotoBoard(this.#manager.rootBoardID)}
        });
        this.#closeButton.toggleAttribute("hide-for-squidly", true);
        this.#backspaceButton = this.#rootGrid.addGridIcon({
            symbol: "leftArrow",
            type: "action",
            events: {"access-click": (e) => this.#ACTION_SET.delete_word.call(this, e)}
        });
        this.#textArea = this.#rootGrid.createChild(AccessTextArea, {
            placeholder: "Output will appear here",
            readonly: true,
        });
    }

    #runActions(e, actions, button) {
        for (const action of actions) {
            if (action.mode in this.#ACTION_SET) {
                this.#ACTION_SET[action.mode].call(this, e, action.value);
            }
        }
    }

    #onButtonClick(e) {
        const {element, button} = e;
        console.log("BUTTON CLICKED:", button);
        const {actions, load_board} = button;
        if (load_board) {
            const id = load_board.id;
            this.gotoBoard(id, e);
        }
        this.#runActions(e, actions, button);
    }

    #onStateChange(e, ...changes) {
        this.dispatchEvent(new AACChange(e, changes));
    }

    /**
     * @param  {OBBoard|string} board
     */
    #setBoard(board) {
        board = typeof board === "string" ? this.#manager.getBoard(board) : board;
        if (this.#renderedBoardID !== board.id) {
            const {columns, rows} = board.grid;
            this.#rootGrid.innerHTML = "";
            this.#rootGrid.size = [rows+1, columns];
            this.#rootGrid.add(this.#closeButton, 0, 1);
            this.#rootGrid.add(this.#backspaceButton, 0, columns-1);
            this.#rootGrid.add(this.#textArea, 0, [2, columns-2]);
            let grid;
            if (board.id in this.#boardCache) {
                grid = this.#boardCache[board.id];
            } else {
                grid = new GridLayout(rows, columns);
                class B extends AACButton { constructor(button_id) { super(button_id, board); } }
                grid.addItemInstances(B, board.grid.order)
                this.#boardCache[board.id] = grid;
            }
            this.#rootGrid.add(grid, [1, rows], [0, columns-1]);
            this.#renderedBoardID = board.id;
        }
    }

    #ACTION_SET = {
        space(e) {
            this.#textArea.insert(" ");
            this.#onStateChange(e, "text", "caretPosition");
        },
        hold() {
    
        },
        return(e) {
            this.gotoBoard(null, e);
        },
        home(e) {
            this.gotoBoard(this.#manager.rootBoardID, e);
        },
        back(e) {
            this.gotoBoard(this.#history[this.#history.length - 2], e);
        },
        clear(e) {
            this.#textArea.clear();
            this.#onStateChange(e, "text", "caretPosition");
        },
        delete_word(e) {
            let valueUpToCaret = this.#textArea.valueUpToCaret.trimEnd();
            let valueAfterCaret = this.#textArea.valueAfterCaret.trimStart();
            let lastSpaceIndex = valueUpToCaret.lastIndexOf(" ");
            if (lastSpaceIndex === -1) {
                this.#textArea.value = valueAfterCaret;
                this.#textArea.caretPosition = 0;
            } else {
                this.#textArea.value = valueUpToCaret.slice(0, lastSpaceIndex + 1) + valueAfterCaret;
                this.#textArea.caretPosition = lastSpaceIndex + 1;
            }
            this.#onStateChange(e, "text", "caretPosition");
        },
        hold_page(e) {
            this.#holdBoard = this.currentBoardID;
            this.#onStateChange(e, "holdBoard");

        },
        append_text(e, s) {
            this.#textArea.insert(s);
            this.#onStateChange(e, "text", "caretPosition");
        },
        insert_text(e, s) {
            let charBeforeCursor = this.#textArea.valueUpToCaret;
            let charAfterCursor = this.#textArea.valueAfterCaret;
            
            if (charBeforeCursor.length > 0 && !charBeforeCursor.endsWith(" ")) {
                s = " " + s;
            } 
    
            if (charAfterCursor.length > 0 && !charAfterCursor.startsWith(" ")) {
                s = s + " ";
            }
            
            this.#textArea.insert(s);
            this.dispatchEvent(new AACInsert(e, s));
            this.#onStateChange(e, "text", "caretPosition");
        }
    }

    get history() {
        return [...this.#history];
    }

    get currentBoardID() {
        return this.#history[this.#history.length - 1] || this.#manager.rootBoardID;
    }

    get state() {
        return {
            text: this.#textArea.value,
            history: [...this.#history],
            holdBoard: this.#holdBoard,
            caretPosition: this.#textArea.caretPosition || 0
        }
    }

    set state(state) {
        if (state.text !== undefined) {
            this.#textArea.value = state.text;
        }
        if (Array.isArray(state.history)) {
            this.#history = state.history;
            this.#setBoard(this.currentBoardID);
        } 
        if (state.holdBoard !== undefined) {
            this.#holdBoard = state.holdBoard;
        }
        if (state.caretPosition !== undefined) {
            this.#textArea.caretPosition = state.caretPosition;
        }
    }

    set manager(manager) {
        this.#manager = manager;
        this.#history = [manager.rootBoardID];
        this.#holdBoard = null;
        this.#textArea.value = "";
        this.#boardCache = {};
        this.#setBoard(manager.boards[manager.rootBoardID])
        this.#onStateChange(new AccessEvent("manager-set"), "history", "holdBoard", "text", "caretPosition");
    }

    gotoBoard(boardID, e) {
        if (this.#manager) {
            const homeID = this.#manager.rootBoardID;
            if (!(boardID in this.#manager.boards)) {
                boardID = this.#holdBoard || homeID;
            }

            this.#setBoard(boardID);
            if (boardID === homeID) {
                this.#history = [];
                this.#holdBoard = null;
            } else  {
                let i = this.#history.indexOf(boardID);
                if (i === -1) {
                    this.#history.push(boardID);
                } else {
                    this.#history = this.#history.slice(0, i + 1);
                }
            }

            this.#onStateChange(e, "history", "holdBoard");
        } else {
            console.warn("No board manager set");
        }
    }
    
    static get usedStyleSheets() {
        return [
            relTo(GridIcon.styleSheet),
            relTo(AccessTextArea.styleSheet),
            new URL("./aac-style.css", import.meta.url).href
        ];
    }
}

SvgPlus.defineHTMLElement(AACBoard, "aac-board");