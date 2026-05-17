import { unzip, zip, zipSync } from 'fflate';
import fs from 'fs';
import https from 'https';
import http from 'http';

export async function loadFile(url, type = "text", onprogress = () => {}) {
    if (!(onprogress instanceof Function)) {
        onprogress = () => {};
    }

    // Local file path
    const isUrl = /^https?:\/\//i.test(url);
    if (!isUrl) {
        return new Promise((resolve, reject) => {
            onprogress(0);
            fs.readFile(url, (err, data) => {
                if (err) return reject(new Error(`Failed to load file from ${url}: ${err.message}`));
                onprogress(1);
                if (type === "arraybuffer") return resolve(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
                const text = data.toString('utf8');
                if (type === "json") {
                    try { resolve(JSON.parse(text)); } catch (e) { reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`)); }
                } else {
                    resolve(text);
                }
            });
        });
    }

    // HTTP/HTTPS URL
    return new Promise((resolve, reject) => {
        const transport = url.startsWith('https') ? https : http;
        onprogress(0);
        transport.get(url, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error(`Failed to load file from ${url}: ${res.statusCode}`));
            }
            const total = parseInt(res.headers['content-length'] || '0', 10);
            let loaded = 0;
            const chunks = [];
            res.on('data', (chunk) => {
                chunks.push(chunk);
                loaded += chunk.length;
                if (total) onprogress(loaded / total);
            });
            res.on('end', () => {
                onprogress(1);
                const buf = Buffer.concat(chunks);
                if (type === "arraybuffer") return resolve(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
                const text = buf.toString('utf8');
                if (type === "json") {
                    try { resolve(JSON.parse(text)); } catch (e) { reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`)); }
                } else {
                    resolve(text);
                }
            });
            res.on('error', (e) => reject(new Error(`Network error while loading file from ${url}: ${e.message}`)));
        }).on('error', (e) => reject(new Error(`Network error while loading file from ${url}: ${e.message}`)));
    });
}

class DataClass {
    /**
     * Creates an instance of the class and populates its properties based on the provided arguments object.
    * @template {DataClass} T
    * @this {new() => T}
    * @param {Object} argsObject
    * @returns {T}
    */
    static make(argsObject) {
        const instance = new this();
        for (const key in instance) {
            if (!(instance[key] instanceof Function)) {
                if (key in argsObject) {
                    let parser = key + "_parser";
                    if (parser in this && this[parser] instanceof Function) {
                        instance[key] = this[parser](argsObject[key]);
                    } else {
                        instance[key] = argsObject[key];
                    }
                } else if (instance[key] === undefined) {
                    throw new Error(`${this.name}: Missing required property: ${key}`);
                }
            }
        }
        return instance;
    }


    /**
     * Creates an instance of the class and populates its properties based on the provided arguments object.
    * @template {DataClass} T
    * @this {new() => T}
    * @param {string} url - The URL to load the data from, which should return a JSON object.
    * @param {function(number):void} onprogress - An optional callback function that receives progress updates as a number between 0 and 1.
    * @returns {Promise<T>}
    */
    static async load(url, onprogress) {
        const data = await loadFile(url, "json", onprogress);
        return this.make(data);
    }
}

class OpenBoardObject extends DataClass {
    /** @type {string} */
    id; 
}

/**
 * This class represents a board to be loaded, 
 * which is used as part of the "load_board" 
 * property on the OB button object.
 */
class OBLoadBoard extends OpenBoardObject {
    id = null;

    /** @type {?string} */
    name = null;        
    
    /** @type {?string} */
    data_url = null;    
    
    /** @type {?string} */
    url = null;         
    
    /** @type {?string} */
    path = null;        
}


class OBSymbol extends DataClass {
    /** @type {string} */
    set;                
    
    /** @type {string} */
    name;  
    
    get path() {
        return `${this.set}/${this.name}`;
    }
}


class OBImage extends OpenBoardObject {
    /** 
     * The width of the image in pixels. 
     * @type {number} 
     * */   
    width;                          
    
    /** 
     * The height of the image in pixels.
     * @type {number} 
     * */
    height;                         
    
    /** 
     * A URL to load the image from. 
     * This can be a relative or absolute URL.
     * @type {?string} 
     * */
    url = null;                     
    
    /** 
     * An optional symbol reference for the image, 
     * which can be used to link a symbol in a symbol set.
     * @type {?OBSymbol} 
     * */
    symbol = null;        
    static symbol_parser(value) { return value ? OBSymbol.make(value) : null; }          
    
    /** 
     * The content MIME type of the image, 
     * such as "image/png" or "image/jpeg".
     * @type {string} 
     * */
    content_type = "image/png";     
    
    /** 
     * An optional license for the image.
     * @type {?object}
     *  */   
    license = null;                 
}

/**
 * This class represents an action associated with a button.
 */
class OBAction {
    constructor(value) {
        if (typeof value === "string") {
            let mode = value[0];
            if (mode in OBAction.MODES) {
                this.mode = OBAction.MODES[mode];
                if (this.mode === "action") {
                    this.mode = value.slice(1);
                    this.value = null;
                } else {
                    this.value = value.slice(1);
                }
            } else {
                this.mode = "unknown";
                this.value = value;
            }
        } else if (value instanceof OBAction) {
            this.mode = value.mode;
            this.value = value.value;
        }
    }

    static get MODES() {
        return {
            ":": "action",
            "+": "append_text",
            "&": "insert_text"
        }
    }
}


class OBButton extends OpenBoardObject {
    /** 
     * The text label to display on the button.
     * @type {?string} */
    label = null;               
    
    /** 
     * The ID of an image to display on the button.
     * @type {?string} */
    image_id = null;            
    
    /** 
     * The ID of a board to load when the button is pressed.
     * @type {?OBLoadBoard} */
    load_board = null;
    static load_board_parser(value) { return value ? OBLoadBoard.make(value) : null; }         
    
    /** 
     * The actions to perform when the button is pressed.
     * @type {OBAction[]} */
    actions = null;   
    static actions_parser(value) { return (value ? (Array.isArray(value) ? value : [value]) : []).map(v => new OBAction(v)); }          
    
    /** 
     * Background color of the button, 
     * in format "rgb(255, 0, 0)" or "rgba(255, 0, 0, .5)"
     * @type {?string} */
    background_color = null;    
    
    /** 
     * Border color of the button, 
     * in format see background_color.
     * @type {?string} */
    border_color = null;        
    
    /** 
     * Text color of the button, 
     * in format see background_color.
     * @type {?string} */
    text_color = null;          
    
    /** 
     * The vocalization associated with the button,
     * which can be a string to speak.
     * @type {?string} */
    vocalization = null;        
    
    /** 
     * The top position of the button in relative
     * coordinates (0 to 1, where 0 is the top 
     * of the board and 1 is the bottom).
     * @type {?number} */
    top = null;                 
    
    /**
     * The left position of the button in relative
     * coordinates (0 to 1, where 0 is the left 
     * of the board and 1 is the right).
     *  @type {?number} */
    left = null;                
    
    /** 
     * The width of the button in relative coordinates 
     * (0 to 1, where 1 is the full width of the board).
     * @type {?number} */  
    width = null;               
    
    /**
     * The height of the button in relative coordinates 
     * (0 to 1, where 1 is the full height of the board).
     *  @type {?number} */
    height = null;

    /**
     * The text to insert when the button is pressed,
     * which can be a string or an array of strings to insert with spaces.
     * @type {?string}
     */
    get textInserted() {
        let textActions = this.actions.filter(a => a.mode === "insert_text").map(a => a.value);
        if (textActions.length > 0) {
            return textActions.join(" ");
        } else {
            return null;
        }
    }
    
    /**
     * The utterance associated with the button, 
     * which is determined by the following precedence:
     * 1. vocalization property
     * 2. text inserted by the button's actions
     * 3. label of the button
     * @type {?string}
     */
    get utterance() {
        return this.vocalization || this.textInserted || this.label
    }
}

class OBGrid extends DataClass {
    /** 
     * The number of rows in the grid.
     * @type {number} */
    rows;      
    
    /** 
     * The number of columns in the grid.
     * @type {number} */
    columns;   
    
    /** 
     * The order of button IDs in the grid, 
     * represented as a 2D array where each 
     * element is a button ID.
     * @type {string[][]} */
    order;     
}

class OBBoard extends OpenBoardObject {
    /** 
     * The grid layout of the board.
     * @type {OBGrid} */
    grid;   
    static grid_parser(value) { return OBGrid.make(value); }                    
    
    /** 
     * The openboard format version.
     * @type {string} */
    format = "open-board-0.1";  
    
    /** 
     * The name of the board, which can be displayed in the UI.
     * @type {?string} */
    name = null;                
    
    /** 
     * A description of the board, which can 
     * be displayed in the UI.
     * @type {?string} */
    description_html = null;    
   
    /** 
     * A URL to load the board from, which can be used 
     * for reference or debugging.
     * @type {?string} */
    url = null;                
    
    /** 
     * The locale of the board, which can be used for 
     * language-specific processing or display.
     * @type {string} */
    locale = "en";              
    
    /**
     * The list of buttons on the board, 
     * where each button is an instance of OBButton.
     *  @type {OBButton[]} */
    buttons = [];      
    static buttons_parser(value) { return value ? value.map(b => OBButton.make(b)) : []; }         
    
    /** 
     * The list of images used on the board, 
     * where each image is an instance of OBImage.
     * @type {OBImage[]} */
    images = [];
    static images_parser(value) {  return value ? value.map(i => OBImage.make(i)) : []; }

    /**
     * Gets a button by its ID from the board's buttons list.
     * @param {string} id - The ID of the button to retrieve.
     * @returns {?OBButton} The button with the specified ID, or undefined if not found.
     */
    getButtonById(id) {
        return this.buttons.find(b => b.id == id);
    }

    /**
     * Gets an image by its ID from the board's images list.
     * @param {string} id - The ID of the image to retrieve.
     * @returns {?OBImage} The image with the specified ID, or undefined if not found.
     */
    getImageById(id) {
        return this.images.find(i => i.id == id);
    }
}

class OBManifestPaths extends DataClass {
    /** 
     * A mapping of board IDs to their corresponding file paths in the manifest.
     * @type {Object.<string, string>} */
    boards;

    /**
     * A mapping of image IDs to their corresponding file paths in the manifest.
     * @type {Object.<string, string>}
     */
    images = null;

    /**
     * A mapping of sound IDs to their corresponding file paths in the manifest.
     * @type {Object.<string, string>}
     */
    sounds = null;
}

class OBManifest extends DataClass {
    /** 
     * The ID of the root board to load when the manifest is loaded,
     * which should correspond to a board ID 
     * or board path in the manifest paths.
     * @type {string} */
    root;

    /** 
     * The paths to the boards, images, and sounds used in the board set,
     * where each path is a string that can be relative to the manifest URL.
     * @type {OBManifestPaths} */
    paths;
    static paths_parser(value) { return OBManifestPaths.make(value); }

    // /** @type {OBImage[]} */
    // images = [];
    // static images_parser(value) { return value ? value.map(i => OBImage.make(i)) : []; }

    /** 
     * The open-board-set format version, which should be 
     * "open-board-set-0.1" for this version of the manifest.
     * @type {string} */
    format = "open-board-set-0.1";

}   

function pjoin(base, relative) {
    relative = relative.replace(/^.?\//, "");
    base = base.endsWith("/") ? base : base + "/";
    return base + relative;
}

function relativeTo(base, path) {
    if (path.startsWith(base)) {
        return path.slice(base.length);
    } else {
        let pathA = path.split("/").filter(s => s.length > 0);
        let baseA = base.split("/").filter(s => s.length > 0);
        console.log("Path array:", pathA);
        console.log("Base array:", baseA);
        let final = [];
        for (let i = 0; i < Math.min(pathA.length); i++) {
            if (pathA[i] !== baseA[i]) {
                final.push(pathA[i]);
            }
        }
        return final.join("/");
    }
}

function dirname(path) {
    let parts = path.split("/").filter(s => s.length > 0);
    parts.pop();
    return parts.join("/") + (parts.length > 0 ? "/" : "");
}

class OBBoardManager extends DataClass {
    /** 
     * A mapping of board IDs to their corresponding OBBoard instances,
     * @type {Object.<string, OBBoard>} */
    boards = {};
    static boards_parser(value) { 
        return value ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, OBBoard.make(v)])) : {}; 
    }

    /** 
     * The manifest object that provides metadata and paths for the board set,
     * @type {OBManifest} */
    manifest;
    static manifest_parser(value) { return OBManifest.make(value); }


    /**
     * Checks if a board with the specified ID exists in the manager.
     * @param {string} id - The ID of the board to check for.
     * @returns {boolean} True if the board exists, false otherwise.
     */
    hasBoard(id) {
        return id in this.boards;
    }

    /**
     * Gets a board by its ID from the manager's boards mapping.
     * @param {string} id - The ID of the board to retrieve.
     * @returns {OBBoard} The board with the specified ID.
      * @throws {Error} If the board with the specified ID is not found in the manager.
     */
    getBoard(id) {
        if (id in this.boards) {
            return this.boards[id];
        } else {
            throw new Error(`Board ID ${id} not found in boards`);
        }
    }

    /**
     * Gets the root board specified by the manifest's 
     * root property.
     * @returns {OBBoard} The root board .
     * @throws {Error} If the root board ID specified 
     *                 in the manifest is not found.
     */
    get rootBoard() {
        const rootID = this.rootBoardID;
        if (rootID in this.boards) {
            return this.boards[rootID];
        } else {
            throw new Error(`Root board ID ${rootID} not found in boards`);
        }
    }

    /**
     * Gets the root board ID specified by the manifest's root property.
     * @returns {string} The root board ID.
     * @throws {Error} If the root board ID cannot be resolved.
     */
    get rootBoardID() {
        let id = this.manifest.root;
        if (!(id in this.boards)) {
            let res = Object.entries(this.manifest.paths.boards).find(([k, v]) => v == id);
            if (res) {
                id = res[0];
            } else {
                throw new Error(`Root board ID ${id} not found in boards or manifest paths`);
            }
        }

        return id;
    }

    /**
     * Loads a board set from a directory URL, where the manifest.json 
     * file is located at the root of the directory and the board files
     * are located at the paths specified in the manifest.
     */
    static async loadFromDirectory(url, onprogress = () => {}) {
        if (!(onprogress instanceof Function)) {
            onprogress = () => {};
        }

        let manifest = await OBManifest.load(url+"/manifest.json", (p) => onprogress(p * 0.1));
        let nBoards = Object.keys(manifest.paths.boards).length;
        let boards = await Promise.all(
            Object.values(manifest.paths.boards).map(async path => 
                OBBoard.load(pjoin(url,path), (p) => onprogress(0.1 + p * 0.9 / nBoards))
            )
        );
        boards = Object.fromEntries(Object.entries(manifest.paths.boards).map(([k, v], i) => [k, boards[i]]));
        return this.make({ manifest, boards });
    }


    saveOBZ(filename) {
        const enc = new TextEncoder();
        const manifest = enc.encode(JSON.stringify(this.manifest));
        const files = {
            "manifest.json": manifest,
            ...Object.fromEntries(Object.entries(this.boards).map(([k, v]) => [
                this.manifest.paths.boards[k],
                enc.encode(JSON.stringify(v))
            ]))
        };
        const zipped = zipSync(files);
        fs.writeFileSync(filename, Buffer.from(zipped));
    }


    /**
     * Loads a board set from a OBZ (zip) file URL, where the manifest.json file
     * is located at the root of a folder for which board files are located 
     * at the paths.
     * @param {string} url - The URL of the OBZ file to load.
     * @param {function(number):void} onprogress - An optional callback function that receives progress updates as a number between 0 and 1.
     */
    static async loadOBZ(url, onprogress = () => {}) {
        if (!(onprogress instanceof Function)) {
            onprogress = () => {};
        }
        const arrayBuffer = await loadFile(url, "arraybuffer", (p) => onprogress(p * 0.95));
        const manager = await this.parseZippedBuffer(arrayBuffer, (p) => onprogress(0.95 + p * 0.05));
        return manager;
    }

    static async parseZippedBuffer(arrayBuffer, onprogress = () => {}) {
        if (!(onprogress instanceof Function)) {
            onprogress = () => {};
        }
        const files = await new Promise((resolve, reject) => {
            unzip(new Uint8Array(arrayBuffer), (err, zipped) => {
                if (err) {
                    reject(err);
                }
                resolve(zipped);
            });
        });
        onprogress(0.5);
        const filePaths = Object.keys(files).filter(path => 
            path.endsWith("manifest.json")
            && !path.includes("../") 
            && !path.includes("..\\") 
            && !path.startsWith("__MACOSX")
            && !path.startsWith(".")
        )

        if (filePaths.length === 0) {
            throw new Error("No manifest.json found in zip file");
        } else if (filePaths.length > 1) {
            console.warn("Multiple manifest.json files found in zip file, using first one:", filePaths);
        }
        const manifestPath = filePaths[0];
        const manifest = OBManifest.make(JSON.parse(new TextDecoder().decode(files[manifestPath])));
        const manifestDir = dirname(manifestPath);
        const boards = Object.fromEntries(await Promise.all(
            Object.entries(manifest.paths.boards).map(([key, path]) => {
                const fullPath = (manifestDir && manifestDir.length > 0) ? pjoin(dirname(manifestPath), path) : path;
                if (fullPath in files) {
                    const board = OBBoard.make(JSON.parse(new TextDecoder().decode(files[fullPath])));
                    return [key, board];
                } else {
                    throw new Error(`Board file ${fullPath} not found in zip file`);
                }
            })
        ));
        onprogress(1);
        return this.make({ manifest, boards });
    }

    /**
     * Loads a board set from a URL, which can either be a directory URL containing a manifest.json file or an OBZ (zip) file URL containing the manifest and board files. The method determines the type of URL based on its extension and calls the appropriate loading method.
     * @param {string} url - The URL to load the board set from, which can be either a directory URL or an OBZ file URL.
     * @param {function(number):void} onprogress - An optional callback function that receives progress updates as a number between 0 and 1, which can be used to track the loading progress of the board set.
     */
    static async load(url, onprogress) {
        if (url.endsWith(".obz") || url.endsWith(".zip")) {
            return await this.loadOBZ(url, onprogress);
        } else {
            return await this.loadFromDirectory(url, onprogress);
        }
    }

}

export { OBBoardManager, OBBoard, OBButton, OBImage, OBSymbol, OBLoadBoard };