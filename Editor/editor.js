import { AACBoard, AACButton, AACGrid } from "../AACWebComponent/aac.js";
import { AccessEvent, GridIcon, GridLayout, ShadowElement, SvgPlus } from "../AACWebComponent/utils.js";
import { OBBoard, OBButton } from "../openboard.js";
import { TextInput, LabeledInput, NullableColorInput,  NumberWithOptions, InputProxy, ToggleInput, InputGroup} from "./inputs.js";

/** Model Editor Extension
 */
class OBButtonEditable extends OBButton {
    hidden = false;
}

class OBBoardEditable extends OBBoard {
    static buttons_parser(buttons) {
        return buttons.map(button => OBButtonEditable.make(button));
    }
}



/**
 * Editor AAC Variations
 */

class AACButtonEditable extends GridIcon {
     /**
     * @param {string} button_id
     * @param  {OBBoard} board
     * @param {string} group
     */
    constructor(button_id, board, group) {
        const button = board.getButtonById(button_id);
        if (button.hidden) {
            super({displayValue: "", type: {theme: "hidden"}, events: {}}, group);

        } else {
            const image = board.getImageById(button.image_id);
            const symbol = image ? image.resolvedURL : null;
            super({
                displayValue: button.label,
                symbol: symbol,
                type: (button.load_board ? "topic-" : "") + "white",
                
            }, group);
            this.styles = AACButton.colorGenerator(button);

            if (!symbol && button.label.length === 1) { 
                this.toggleAttribute("character-button", true);
            }
            if (button.hidden) {
                this.styles = {opacity: "0.5"};
            }
        }
        this.buttonID = button_id;
    }
}

class AACEditorGrid extends GridLayout {
    #selectedButton = null;
    #selectedButtonID = null;

    /**
     * @param {OBBoard} board
     */
    constructor(board) {
        super(board?.grid?.rows || 1, board?.grid?.columns || 1);
        this.board = board;
    }

    /**
     * @param {OBBoard} board
     */
    set board(board) { 
        this.innerHTML = "";
        if (board) {
            const {columns, rows} = board.grid;
            this.size = [rows, columns];

            const root = this;
            class B extends AACButtonEditable { 
                constructor(button_id, group) { 
                    super(button_id, board, "aa-"+group); 
                    this.events = {
                        "access-click": () => {
                            root.select(button_id);
                        }
                    }
                } 
            }
            this.addItemInstances(B, board.grid.order)
        } else {
            this.size = [1, 1];
        }

        const {selectedButton} = this;
        if (selectedButton) {
            this.#selectedButtonID = null;
            this.select(selectedButton);
        }
    }

    select(buttonID) {
        if (this.#selectedButtonID === buttonID) {
            buttonID = null;
        }
        for (let button of this.querySelectorAll("access-button")) {
            button.highlight = button.buttonID === buttonID;
        }
        this.#selectedButtonID = buttonID;
        if (this.onSelect instanceof Function) {
            this.onSelect(buttonID);
        }
    }

    get selectedButton() {
        return this.#selectedButtonID;
    }
}


const MAX_SIZE = 12;

/**
 * Editor Input Tools
 */
class GridTools extends InputGroup {
    constructor() {
        super("div");
        this.class = "editor-tools top";
        const sizeOptions = new Array(MAX_SIZE).fill(0).map((_, i) => i+1);
        this.inputs = {
            title: this.createChild(LabeledInput, {}, "Title:", TextInput),
            rows: this.createChild(LabeledInput, {}, "Rows:", NumberWithOptions, sizeOptions, 5),
            columns: this.createChild(LabeledInput, {}, "Columns:", NumberWithOptions, sizeOptions, 5),
        }
        this.parsers = {
            rows: parseInt,
            columns: parseInt
        }
    }
}

const DefaultActions = [
    {
        action: ":go-home",
        label: "Go Home"
    },
    {
        action: ":go-back",
        label: "Go Back"
    },
    {
        action: ":clear",
        label: "Clear"
    },
    {
        action: ":space",
        label: "Space"
    },
    {
        action: ":enter",
        label: "Enter"
    },
    {
        action: ":backspace",
        label: "Backspace"
    },
    {
        action: (p) => `+${p[0]}`,
        label: "Append Text",
        params: [
            {
                type: "text",
                default: (v) => v.label
            }
        ]
    },
    {
        action: (p) => `&${p[0]}`,
        label: "Add Word",
        params: [
            {
                type: "text",
                default: (v) => v.label
            }
        ]
    },
    {
        action: (p) => `:${p[0]}`,
        label: "Custom",
        params: [
            {
                type: "text",
                default: (v) => v.label
            }
        ]
    }
]


class ActionItem extends InputProxy { 
    constructor(action) {
        super("div");
        this.class = "action-item";
        let header = this.createChild("div");
        header.createChild("div", {content: action.label});
        header.createChild()
    }
}
class AddActions extends InputProxy {
    value = [];
    constructor() {
        super("div");
        this.class = "add-actions";
        let row = this.createChild("div", {class: "row"});
        row.createChild("label", {content: "Actions: "});

        let add = row.createChild("div", {class: "add"});
        
        this.selection = add.createChild("select", {
            events: {
                change: () => {
                    if (this.selection.value) {
                        this.value.push(this.selection.value);

                        let a = DefaultActions[this.selection.value];
                        let ae = this.list.createChild("div");
                        ae.createChild("div", {content: a.label});
                        ae.params = []
                        a.params && a.params.forEach(param => {
                            let input;
                            if (param.type === "text") {
                                input = ae.createChild("input", {type: "text", value: param.default({label: ""})});
                                ae.params.push(input)
                            }
                        })
                        ae.action = a;


                    }
                    this.selection.value = null;
                }
            }
        });

        DefaultActions.forEach((action, i) => {
            this.selection.createChild("option", {
                value: i, 
                content: action.label
            });
        });

        this.selection.value = null;
        add.createChild("div", {content: "+"});
        add.events = {click: () => {
            this.selection.showPicker();
        }}
        this.list = this.createChild("div", {class: "added-actions"});
    }

    getValue() {
        let actions = [...this.list.children].map(({action, params}) => {
            let paramValues = params ? params.map(p => p.value) : [];
            if (action.action instanceof Function) {
                return action.action(paramValues);
            } else {
                return action.action;
            }
        });
        return actions;
    }

    // setValue(value) {
    //         this.list.innerHTML = "";
    //         value.forEach(val => {                let action = DefaultActions.find(a => {
    //                 if (a.action instanceof Function) {
    //                     return a.action([]) === val;
    //                 } else {
    //                     return a.action === val;
    //                 }
    //             });

    // }
    
}



class ButtonTools extends InputGroup {
    constructor() {
        super("div");
        this.class = "editor-tools side";

        this.inputs = {
            hidden: this.createChild(LabeledInput, {
                "show-when-hidden": true,
                row: true
            }, "Hidden:", ToggleInput),
            label: this.createChild(LabeledInput, {}, "Label:", TextInput),
            vocalization: this.createChild(LabeledInput, {}, "Vocalization:", TextInput),
            background_color: this.createChild(LabeledInput, {row:true}, "Background:", NullableColorInput, "rgb(255, 255, 255)"),
            border_color: this.createChild(LabeledInput, {row:true}, "Outline:", NullableColorInput, "rgb(0, 0, 0)"),
        }
        this.parsers = {
            vocalization: (v) => v.trim()
        }

        this.events = {
            change: () => {
                this.inputs.vocalization.placeholder = this.inputs.label.value;
            }
        }
        
    }
    setValue(value) {
        super.setValue(value);
        this.toggleAttribute("is-hidden", value?.hidden);
        this.inputs.vocalization.placeholder = this.inputs.label.value;
    }
   
}

class OpenBoardEditor extends ShadowElement {
    #allButtons = [];
    #topTools = null;
    #buttonTools = null;
    constructor(el = "open-board-editor") {
        super(el, new SvgPlus("editor-root"));
        

        this.#topTools = this.createChild(GridTools, {events: {
            change: () => {
                this.grid.board = this.board;
            }
        }});
        // this.#buttonTools = this.createChild();


        this.#allButtons = new Array(MAX_SIZE).fill(0).flatMap(
            (_, r) => new Array(MAX_SIZE).fill(0).map((_, c) => OBButtonEditable.make({id: `${r}-${c}`, label: ""}))
        );


        let main = this.createChild("div", {class: "editor-main"});
        this.grid = main.createChild(AACEditorGrid, {}, this.board);
        this.#buttonTools = main.createChild(ButtonTools, {
            events: {
                input: () => {
                    console.log("CHANGE", this.#buttonTools.value);
                    let buttonID = this.grid.selectedButton;
                    let button = this.#allButtons.find(b => b.id === buttonID);
                    if (button) {
                        Object.assign(button, this.#buttonTools.value);
                        this.grid.board = this.board;
                    }
                }
            }
        });
        this.#buttonTools.toggleAttribute("hide-tools", true);


        this.grid.onSelect = (buttonID) => {
            let button = this.#allButtons.find(b => b.id === buttonID);
            if (button) {
                this.#buttonTools.value = button;
            } 
            this.#buttonTools.toggleAttribute("hide-tools", !button);
        }
    }

    get board() {
        let {rows, columns, title} = this.#topTools.value;
        const layout = new Array(rows).fill(0).map((_, r) => new Array(columns).fill(0).map((_, c) => `${r}-${c}`));
        return OBBoardEditable.make({
            id: "123", 
            name: title, 
            buttons: this.#allButtons, 
            grid: {rows: rows, columns: columns, order: layout}
        });
    }

     static get usedStyleSheets() {
        return [
            ...AACBoard.usedStyleSheets,
            new URL("./styles.css", import.meta.url).href
        ];
    }
}


export { OpenBoardEditor }