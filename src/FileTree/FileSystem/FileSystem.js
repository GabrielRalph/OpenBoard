/**
 * This module provides a simple in-memory file system implementation with basic file and directory operations.
 * Directories can also be files
 */


const DEBUG = 
// () => void 0;
(...args) => console.log("%c[FileSystem]", "color: blue; font-weight: bold;", ...args);


class ChangeExecuter {
    /** @type {boolean} */
    conflict = false;

    /** @type {boolean} */
    changed = false;
    
    /** @type {?string} */
    error = null;

    /** @type {?Path|string} */
    newPath = null;

    #execute = () => {};
    #executed = false;

    constructor() {}

    /**
     * Sets the function to execute the change.
     * The function should return a promise that 
     * resolves when the change is complete.
     */
    set execute(func) {
        if (func instanceof Function) {
            this.#execute = async () => {
                let result = func();
                this.#executed = true;
                return result;
            }
        } else {
            throw new Error("execute must be a function");
        }
    }

    /**
     * Returns a function that executes the change. 
     * The function returns a promise that resolves
     * when the change is complete.
     * @returns {() => any}
     */
    get execute() {
        return this.#execute;
    }

    /**
     * Returns true if the change has been executed, false otherwise.
     * @returns {boolean}
     * */
    get executed() {
        return this.#executed;
    }
}

export const PS = "\\"

const DIR = {isDirectory: true}

export class FStats {
    constructor(path, file, fs) {
        file = file && typeof file === "object" ? file : {};
        this.path = path;
        this.metadata = file;
    }

    get contents() {
        return deepCopy(this.metadata);
    }

    get isDirectory() {
        return this.metadata.isDirectory === true;
    }

    get dateCreated() {
        return this.metadata.dateCreated || null;
    }

    get lastUpdated() {
        return this.metadata.lastUpdated || null;
    }
}

function deepCompare(obj1, obj2) {
    if (typeof obj1 !== typeof obj2) return false;
    if (obj1 && obj2 && typeof obj1 === 'object') {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) return false;
        for (let key of keys1) {
            if (!deepCompare(obj1[key], obj2[key])) return false;
        }
        return true;
    }
    return obj1 === obj2;
}

function deepCopy(obj) {
    if (obj && typeof obj === 'object') {
        const copy = Array.isArray(obj) ? [] : {};
        for (let key in obj) {
            copy[key] = deepCopy(obj[key]);
        }
        return copy;
    }
    return obj;
}

export class Path {
    #parts = [];
    #path = "";

    /**
     * @param {string} path the string representation of the path
     */
    constructor(path, throwError = false) {
        path = path instanceof Path ? path.path : path;
        if (typeof path !== "string" || path.length === 0) {
            if (throwError) {
                throw new Error("Path must be a non-empty string");
            } else {
                path = "";
            }
        }

        this.#parts = path.split(PS).filter(p => p.length > 0);
        this.#path = this.#parts.join(PS);
    }

    /**
     * @returns {string} the string representation of the path
     */
    get path() {
        return this.#path;
    }

    /**
     * @returns {string[]} the parts of the path as an array of strings
     */
    get parts() {
        return [...this.#parts];
    }

    /**
     * @returns {number} the number of parts in the path
     */
    get length() {
        return this.#parts.length;
    }

    /**
     * @returns {string} the name of the last part of the path
     */
    get name() {
        return this.#parts[this.#parts.length - 1] || "";
    }

    /**
     * @returns {?Path} 
     */
    get parent() {
        let parent = null;
        if (this.#parts.length > 0) {
            const parentPathArray = this.#parts.slice(0, this.#parts.length - 1);
            parent = new Path(parentPathArray.join(PS));
        }
        return parent;
    }

    /**
     * @param {string|Path} other the other path to join with this path
     * @returns {Path} a new Path object representing the joined path
     */
    join(other) {
        if (!(other instanceof Path)) {
            other = new Path(other);
        }
        let newParts = [...this.#parts, ...other.parts];
        return new Path(newParts.join(PS));
    }

    /**
     * @param {string|Path} otherPath the other path to check if it is contained within this path
     * @returns {boolean} true if the other path is contained within this path, false otherwise
     */
    contains(otherPath) {
        if (!(otherPath instanceof Path)) {
            otherPath = new Path(otherPath);
        }
        return this.#parts.every((p, i) => otherPath.parts[i] === p);
    }

    isParentOf(otherPath) {
        if (!(otherPath instanceof Path)) {
            otherPath = new Path(otherPath);
        }
        return this.#parts.length < otherPath.parts.length && this.contains(otherPath);
    }

    same(otherPath) {
        if (!(otherPath instanceof Path)) {
            otherPath = new Path(otherPath);
        }
        return this.#path === otherPath.path;
    }

    /**
     * @param {...number} args the arguments to slice the path parts
     * @returns {Path} a new Path object representing the sliced path
     * 
     * Example:
     * let path = new Path("folderA\\subfolderA\\file1.txt");
     * let slicedPath = path.slice(0, 2); // returns a new Path object with path "folderA\\subfolderA"
     */
    slice(...args) {
        let slicedParts = this.#parts.slice(...args);
        return new Path(slicedParts.join(PS));
    }

    /**
     * @returns {string} the string representation of the path
     */
    toString() {
        return this.path;
    }

    /**
     * @returns {Path} a new Path object that is a clone of this path
     */
    clone() {
        return new Path(this.path);
    }
}


class FSAsObject {
    constructor() {
        this.children = {};
        this.parent = null;
        this.name = "";
        this.hasValue = false;
        this.value = undefined;
    }

    set(path, value) {
        path = path instanceof Path ? path : new Path(path);
        if (value === null) {
            this.delete(path);
            return;
        }
        const node = this.#getNode(path, true);
        node.hasValue = true;
        node.value = value;
    }

    get(path) {
        path = path instanceof Path ? path : new Path(path);
        const node = this.#getNode(path, false);
        if (!node) return undefined;
        return node;
    }

    getChildrenPaths(path) {
        path = path instanceof Path ? path : new Path(path);
        const node = this.#getNode(path, false);
        if (!node) return [];
        return Object.keys(node.children).map(childName => path.join(childName));
    }

    getAllPaths(path) {
        path = path instanceof Path ? path : new Path(path);
        const node = this.#getNode(path, false);
        if (!node) return [];
        const paths = [];
        function traverse(n, currentPath) {
            if (n.hasValue) {
                paths.push(currentPath);
            }
            for (const childName in n.children) {
                traverse(n.children[childName], currentPath.join(childName));
            }
        }
        traverse(node, path);
        return paths;
    }
    

    delete(path) {
        path = path instanceof Path ? path : new Path(path);
        const node = this.#getNode(path, false);
        if (!node) return;

        node.hasValue = false;
        node.value = undefined;

        let cur = node;
        while (cur.parent && !cur.hasValue && Object.keys(cur.children).length === 0) {
            const p = cur.parent;
            delete p.children[cur.name];
            cur = p;
        }
    }

    #getNode(path, buildOut = false) {
        let node = this;
        for (const part of path.parts) {
            if (!(part in node.children)) {
                if (!buildOut) return undefined;
                node.children[part] = {
                    children: {},
                    parent: node,
                    name: part,
                    hasValue: false,
                    value: undefined
                };
            }
            node = node.children[part];
        }
        return node;
    }
}


/**
 * @template {FStats} T
 */
export class FileSystem {
    #filelist = {};
    #filelist2path = {};
    #fstatsClass = FStats;
    #fsAsObject = new FSAsObject();

    #history = [];
    #currentHistorySet = {};
    #historyIndex = 0;
    #historyLimit = 100;
    

    /**
     * @param {new (path: string, contents: any, dirOverride: boolean) => T} FStatsClass the class to use for file stats
     */
    constructor(FStatsClass = FStats) {
        this.#fstatsClass = FStatsClass;
    }

    _commitHistory(newPath, oldPath) {
        this.#history = this.#history.slice(0, this.#historyIndex);
        this.#history.push({
            newPath: newPath,
            oldPath: oldPath,
            set: this.#currentHistorySet
        });
        this.#currentHistorySet = {}
        if (this.#history.length > this.#historyLimit) {
            this.#history.shift();
        }
        this.#historyIndex = this.#history.length;
        // try {throw new Error("test")} catch (e) {console.log(e.stack)}
        DEBUG("New History", this.#history);
    }

    _mergeWithLastHistory(newPath, oldPath) {
        if (this.#history.length > 0) {
            let lastHistorySet = this.#history[this.#history.length - 1];
            for (let path in this.#currentHistorySet.set) {
                if (!(path in lastHistorySet)) {
                    lastHistorySet[path] = this.#currentHistorySet[path];
                } else {
                    lastHistorySet[path].newValue = this.#currentHistorySet[path].newValue;
                }
            }
            lastHistorySet.newPath = lastHistorySet.newPath || newPath;
            lastHistorySet.oldPath = lastHistorySet.oldPath || oldPath;
            this.#currentHistorySet = {};
        } else {
            this._commitHistory(mewPath, oldPath);
        }
        DEBUG("Merged History", this.#history);
    }

    _discardCurrentHistory() {
        this.#currentHistorySet = {};
    }

    get history() {
        return [...this.#history];
    }

    undo() {
        let res = null;
        if (this.#history.length > 0 && this.#historyIndex > 0) {
            this.#historyIndex--;
            let historySet = this.#history[this.#historyIndex];
            for (let path in historySet.set) {
                let {oldValue} = historySet.set[path];
                this._set(path, oldValue, false);
            }
            this._onUpdate();
            res = [historySet.newPath, historySet.oldPath];
        }
        console.log("UNDO: historyIndex", this.#historyIndex, "history length", this.#history.length, this.#history);
        return res;
    }

    redo() {
        let res = null;
        if (this.#history.length > 0 && this.#historyIndex < this.#history.length) {
            let historySet = this.#history[this.#historyIndex];
            for (let path in historySet.set) {
                let {newValue} = historySet.set[path];
                this._set(path, newValue, false);
            }
            this.#historyIndex++;
            res = [historySet.newPath, historySet.oldPath];
            this._onUpdate();
        }
        return res;
    }
    
    clearHistory() {
        this.#history = [];
        this.#currentHistorySet = {};
    }

    /**
     * @param {string|Path} path the path to check for existence
     * @returns {boolean} returns true if the path exists in the file system, false otherwise.
     * */
    _has(path) {
        if (path instanceof Path) {
            path = path.path;
        } else if (typeof path !== "string") {
            path = "";
        }
        return path in this.#filelist;
    }

    _get(path) {
        if (path instanceof Path) {
            path = path.path;
        } else if (typeof path !== "string") {
            path = "";
        }
        return this.#filelist[path];
    }

    _set(path, value, commitHistory = true) {
        // DEBUG("set", path+"", value);
        // try {
        //     throw new Error()
        // } catch (e) {
        //     console.log("Stack trace for _set call:", e.stack);
        // }

        path = path instanceof Path ? path : new Path(path);
        let isChanged = false;
        if (value === null) {
            isChanged = this._deleteFile(path, commitHistory);
        } else {
            let oldValue = this._get(path) ?? null;
            isChanged = !this._has(path) || !deepCompare(oldValue, value);
            this.#filelist[path] = value;
            this.#filelist2path[path] = path;
            this.#fsAsObject.set(path, value);
            if (isChanged && commitHistory) {
                DEBUG("commiting change to history")
                let pathStr = path.toString();
                if (!(pathStr in this.#currentHistorySet)) {
                    this.#currentHistorySet[pathStr] = {
                        oldValue: deepCopy(oldValue),
                    }
                }
                this.#currentHistorySet[pathStr].newValue = deepCopy(value);
            }
        }
        return isChanged;
    }

    _deleteFile(path, commitHistory = true) {
        path = path instanceof Path ? path : new Path(path);
        let isChanged = this._has(path);
        if (isChanged && commitHistory) {
            let pathStr = path.toString();
            if (!(pathStr in this.#currentHistorySet)) {
                this.#currentHistorySet[pathStr] = {
                    oldValue: deepCopy(this._get(path) ?? null),
                }
            }
            this.#currentHistorySet[pathStr].newValue = null;
        }
        delete this.#filelist[path];
        delete this.#filelist2path[path];
        this.#fsAsObject.delete(path);
        return isChanged;
    }

    /**
     * @param {string|Path} path the path to check for existence
     * @returns {boolean} returns true if the path exists in the file system, false otherwise.
     */
    _contains(path) {
        return !!this.#fsAsObject.get(path);
        // path = path instanceof Path ? path : new Path(path);
        // const files = Object.entries(this.#filelist2path);
        // const isDir = files.some(([k, a]) => path.contains(a));
        // return isDir;
    }

    _containing(path) {
        path = path instanceof Path ? path : new Path(path);
        return this.#fsAsObject.getAllPaths(path);
    }

    _createDirectory(path) {
        path = path instanceof Path ? path : new Path(path);
        this._set(path, DIR);
    }


    isDirectory(path) {
        let stat = this.stat(path);
        return stat ? stat.isDirectory : true;
    }

    /**
     * @param {string|Path} path the path to check for existence
     * @returns {ChangeExecuter} returns a ChangeExecuter object that can be used to execute the change.
     */
    getDeleteExecuter(path) {
        let change = new ChangeExecuter();
        path = path instanceof Path ? path : new Path(path);
        let stat = this.stat(path);
        if (!stat) {
            change.error = "Path does not exist: " + path;
        } else {
            let p1 = Promise.resolve();
            change.changed = true;
            let files = this.readdirRecursive(path, true);
            change.execute = async () => {
                files.map(f => this._deleteFile(f.path));
                this._commitHistory();
                this._onUpdate();
            }
            change.newPath = path.parent;
        }
        return change;
    }

    /**
     * @param {string|Path} path the path to check for existence
     * @returns {ChangeExecuter} returns a ChangeExecuter object that can be used to execute the change.
     */
    getAddDirectoryExecuter(path) {
        let result = new ChangeExecuter();
        let fstat = this.stat(path);
        if (fstat !== null) {
            result.conflict = true;
        } else {
            result.execute = async () => {
                await this._createDirectory(path);
                this._commitHistory();
                this._onUpdate();
            }
        }
        return result;
    }
    
    /**
     * @param {string|Path} oldPath the path to move from
     * @param {string|Path} newPath the path to move to
     * @return {ChangeExecuter}
     */
    getMoveExecuter(oldPath, newPath) {
        const result = new ChangeExecuter();
        oldPath = oldPath instanceof Path ? oldPath : new Path(oldPath);
        newPath = newPath instanceof Path ? newPath : new Path(newPath);

        if (!oldPath.same(newPath)) {
            let npStat = this.stat(newPath);
            let opStat = this.stat(oldPath);
            if (!this.isDirectory(newPath)) {
                result.error = "Cannot move to a non-directory path: " + newPath;
            } else if (!opStat) {
                result.error = "Cannot move a non-existent path: " + oldPath;
            } else {
                result.changed = true;

                result.newPath = newPath.join(oldPath.name);
                result.conflict = this.stat(result.newPath) !== null;

                result.execute = async () => {
                    // If there is a conflict, we need to remove the 
                    // files in the new path before moving the old 
                    // path to the new path
                    if (result.conflict) {
                        let rmvFiles = this.readdirRecursive(result.newPath, true);
                        rmvFiles.map(f => this._deleteFile(f.path));
                    }

                    let files = this.readdirRecursive(oldPath, true);
                    files.map(f => {
                        let relativePath = f.path.slice(oldPath.length-1);
                        let newFilePath = newPath.join(relativePath);
                        return [
                            this._set(f.path, null),
                            this._set(newFilePath, f.contents)
                        ]
                    });
                    this._commitHistory();
                    this._onUpdate();
                }
            }
        }
        return result;
    }


    /**
     * @param {string|Path} path the path to check for existence
     * @return {ChangeExecuter}
     */
    getRenameExecuter(path, newName) {
        const result = new ChangeExecuter();

        path = path instanceof Path ? path : new Path(path);
        result.newPath = path.parent.join(newName);

        let oStat = this.stat(path);
        let nStat = this.stat(result.newPath);

        if (!oStat) {
            result.error = "Cannot rename a non-existent path: " + path;
        } else {
            result.changed = true;
            result.conflict = nStat !== null;

            result.execute = async () => {
                if (result.conflict) {
                    let rmvFiles = this.readdirRecursive(result.newPath, true);
                    rmvFiles.map(f => this._deleteFile(f.path));
                }

                let files = this.readdirRecursive(path, true);
                files.map(f => {
                    let parts = f.path.parts;
                    parts[path.length - 1] = newName;
                    let npath = new Path(parts.join(PS));

                    DEBUG(`Renaming file ${f.path} to ${npath}`);
                    return [
                        this._set(f.path, null),
                        this._set(npath, f.contents)
                    ]
                });
                this._commitHistory();
                this._onUpdate();
            }
        }
        return result;
    }


    /**
     * @param {function(FStats, string): boolean} method a function that takes a FStats object and its path as arguments and returns a boolean indicating whether the file matches the search criteria.
     * @returns {FStats[]} returns an array of FStats objects that match the search criteria.
     * */
    searchFiles(method) {
        return Object.entries(this.#filelist).filter(([path, file]) => method(file, path)).map(([path, file]) => this.stat(path));
    }


    /** 
     * Gets the status at 
     * @param {string|Path} path the path to check for status
     * @returns {T|null} returns a FStats object if the path exists, null otherwise.
     * */
    stat(path) {
        const Stats = this.#fstatsClass;
        path = path instanceof Path ? path : new Path(path);
        let stats = null;
        if (this._has(path)) {
            // this.#fsAsObject.get(path).children && Object.keys(this.#fsAsObject.get(path).children).length > 0;
            stats = new Stats(path.clone(), this._get(path), this);
        } else {
            if (this._contains(path)) {
                stats = new Stats(path.clone(), DIR, this);
            }
        }
        return stats;
    }

    /**
     * @param {string|Path} path the path to check for existence
     * @returns {boolean} returns true if the path exists in the file system, false otherwise.
     */
    exists(path) {
        path = path instanceof Path ? path : new Path(path);
        return this._has(path) || this._contains(path);
    }

    /**
     * @param {string|Path} path the path to check for existence
     * @returns {T[]} returns an array of FStats objects representing the files and directories in the specified path.
     * If the path does not exist or is not a directory, an empty array is returned.
     */
    readdir(path) {
        path = path instanceof Path ? path : new Path(path);
        return this.#fsAsObject.getChildrenPaths(path)
            .map(this.stat.bind(this))
            .filter(f => f !== null);
    }

    /**
     * @param {string|Path} path the path to check for existence
     * @returns {T[]} returns an array of FStats objects representing 
     * the files and directories in the specified path and all its subdirectories.
     * If the path does not exist or is not a directory, an empty array is returned.
     */
    readdirRecursive(path, includeRoot = false ) {
        path = path instanceof Path ? path : new Path(path);
        let result =  this.#fsAsObject.getAllPaths(path)
            .map(this.stat.bind(this))
            .filter(f => f !== null);
        if (includeRoot && this._has(path)) {
            result.push(this.stat(path));
        }
        return result;
    }

    _onUpdate() {
    }
}

