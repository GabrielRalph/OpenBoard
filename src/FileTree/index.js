import { AACBoard } from "../AACWebComponent/aac.js";
import { AACFinder } from "./AACFS.js";
AACFinder.defineHTMLElement(AACFinder, "aac-finder");
document.querySelector("aac-finder").setFirebasePath("squidly");

