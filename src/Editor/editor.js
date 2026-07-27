import { AACBoard} from "../AACWebComponent/aac.js";
import { delay, ShadowElement, SvgPlus } from "../Utilities/utils.js";
import { AACEditorGrid, OBBoardEditable } from "./aac-editable.js";
import { ColorPicker } from "../Utilities/color-picker.js";
import { FastFindImageList, ImageFinder } from "../IconSearch/image-finder.js";


const example = {
	"id": "hTV21ePzopaejc2Pq7r7",
	"grid": {
		"rows": 4,
		"columns": 9,
		"order": [
			[
				"B0_0",
				"B0_1",
				"B0_2",
				"B0_3",
				"B0_4",
				"B0_5",
				"B0_6",
				"B0_7",
				"B0_8"
			],
			[
				null,
				"B1_1",
				"B1_2",
				"B1_3",
				"B1_4",
				"B1_5",
				"B1_6",
				"B1_7",
				"B1_8"
			],
			[
				null,
				"B2_1",
				null,
				"B2_3",
				"B2_4",
				"B2_5",
				null,
				"B2_7",
				null
			],
			[
				"B3_0",
				null,
				null,
				"B3_3",
				null,
				"B3_5",
				null,
				"B3_7",
				"B3_8"
			]
		]
	},
	"format": "open-board-0.1",
	"name": null,
	"description_html": null,
	"url": null,
	"locale": "en",
	"buttons": [
		{
			"id": "B0_0",
			"font_size": "medium",
			"label": null,
			"image_id": "SCSH_GOHOME1",
			"load_board": null,
			"actions": [
				":home"
			],
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": null,
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B0_1",
			"font_size": "medium",
			"label": "NATURE",
			"image_id": "SCSH_NATURE",
			"load_board": {
				"id": "jOcHyRb3NCWoHbLk4o7O",
				"name": null,
				"data_url": null,
				"url": null,
				"path": null
			},
			"actions": null,
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": "rgb(250, 224, 195)",
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B0_2",
			"font_size": "medium",
			"label": "SUPPLIES",
			"image_id": "SCSH_ARTSUPP~",
			"load_board": {
				"id": "v0s70WrgtO5HAOURsJbq",
				"name": null,
				"data_url": null,
				"url": null,
				"path": null
			},
			"actions": null,
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": "rgb(250, 224, 195)",
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B0_3",
			"font_size": "medium",
			"label": "red",
			"image_id": "SCSH_RED",
			"load_board": null,
			"actions": [
				"&red",
				":return"
			],
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": null,
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B0_4",
			"font_size": "medium",
			"label": "orange",
			"image_id": "SCSH_ORANGE2",
			"load_board": null,
			"actions": [
				"&orange",
				":return"
			],
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": null,
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B0_5",
			"font_size": "medium",
			"label": "yellow",
			"image_id": "SCSH_YELLOW",
			"load_board": null,
			"actions": [
				"&yellow",
				":return"
			],
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": null,
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B0_6",
			"font_size": "medium",
			"label": "green",
			"image_id": "SCSH_BROWN",
			"load_board": null,
			"actions": [
				"&green",
				":return"
			],
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": null,
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B0_7",
			"font_size": "medium",
			"label": "blue",
			"image_id": "SCSH_BLUE",
			"load_board": null,
			"actions": [
				"&blue",
				":return"
			],
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": null,
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B0_8",
			"font_size": "medium",
			"label": "MORE",
			"image_id": "SCSH_down5_02",
			"load_board": {
				"id": "pw6KyBoKHqoXhrgA2des",
				"name": null,
				"data_url": null,
				"url": null,
				"path": null
			},
			"actions": null,
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": null,
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B1_1",
			"font_size": "medium",
			"label": "color",
			"image_id": "SCSH_COLOR",
			"load_board": null,
			"actions": [
				"&color",
				":return"
			],
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": "rgb(171, 225, 161)",
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B1_2",
			"font_size": "medium",
			"label": "works",
			"image_id": "SCSH_S_0B",
			"load_board": null,
			"actions": [
				"&colors",
				":return"
			],
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": "rgb(171, 225, 161)",
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B1_3",
			"font_size": "medium",
			"label": "working",
			"image_id": "SCSH_ING_0B",
			"load_board": null,
			"actions": [
				"&coloring",
				":return"
			],
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": "rgb(171, 225, 161)",
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B1_4",
			"font_size": "medium",
			"label": "asked",
			"image_id": "SCSH_ED_0B",
			"load_board": null,
			"actions": [
				"&colored",
				":return"
			],
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": "rgb(171, 225, 161)",
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B1_5",
			"font_size": "medium",
			"label": "to color",
			"image_id": "SCSH_TO_0B",
			"load_board": null,
			"actions": [
				"&to color",
				":return"
			],
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": "rgb(171, 225, 161)",
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B1_6",
			"font_size": "medium",
			"label": "big",
			"image_id": "SCSH_MOUNTAIN",
			"load_board": null,
			"actions": [
				"&big",
				":return"
			],
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": "rgb(183, 198, 249)",
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B1_7",
			"font_size": "medium",
			"label": "color",
			"image_id": "SCSH_PAINT_M1",
			"load_board": null,
			"actions": [
				"&color",
				":return"
			],
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": "rgb(227, 162, 94)",
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B1_8",
			"font_size": "medium",
			"label": "things",
			"image_id": "SCSH_NOUNPL",
			"load_board": null,
			"actions": [
				"&colors",
				":return"
			],
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": "rgb(227, 162, 94)",
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B2_1",
			"font_size": "medium",
			"label": "CLIMB/HIGH",
			"image_id": "SCSH_HIGH",
			"load_board": {
				"id": "LMQKXwK0ht13pZPOLrMo",
				"name": null,
				"data_url": null,
				"url": null,
				"path": null
			},
			"actions": null,
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": "rgb(213, 213, 213)",
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B2_3",
			"font_size": "medium",
			"label": "DRAW",
			"image_id": "SCSH_DRAW2A",
			"load_board": {
				"id": "hMRhGIcwMugOv2pdtg3L",
				"name": null,
				"data_url": null,
				"url": null,
				"path": null
			},
			"actions": null,
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": "rgb(213, 213, 213)",
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B2_4",
			"font_size": "medium",
			"label": "light",
			"image_id": "SCSH_MORNING2",
			"load_board": null,
			"actions": [
				"&light",
				":return"
			],
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": null,
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B2_5",
			"font_size": "medium",
			"label": "PAINT",
			"image_id": "SCSH_PAINT2",
			"load_board": {
				"id": "UWadkcqKNcV32htNcrVH",
				"name": null,
				"data_url": null,
				"url": null,
				"path": null
			},
			"actions": null,
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": "rgb(213, 213, 213)",
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B2_7",
			"font_size": "medium",
			"label": "GET",
			"image_id": "SCSH_GET2",
			"load_board": {
				"id": "9UC2ZEpM9h8wdZFuUvCU",
				"name": null,
				"data_url": null,
				"url": null,
				"path": null
			},
			"actions": null,
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": "rgb(213, 213, 213)",
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B3_0",
			"font_size": "medium",
			"label": "CLEAR",
			"image_id": "SCSH_CLEAR_EG",
			"load_board": null,
			"actions": [
				":clear"
			],
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": null,
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B3_3",
			"font_size": "medium",
			"label": "CUT",
			"image_id": "SCSH_CUT1",
			"load_board": {
				"id": "3ayINr3Yv9PhH7qkcniF",
				"name": null,
				"data_url": null,
				"url": null,
				"path": null
			},
			"actions": null,
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": "rgb(213, 213, 213)",
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B3_5",
			"font_size": "medium",
			"label": "dark",
			"image_id": "SCSH_NIGHT",
			"load_board": null,
			"actions": [
				"&dark",
				":return"
			],
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": null,
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B3_7",
			"font_size": "medium",
			"label": "RECYCLE",
			"image_id": "SCSH_RECYCLE",
			"load_board": {
				"id": "QI49Y7mivcEZXVKyplvA",
				"name": null,
				"data_url": null,
				"url": null,
				"path": null
			},
			"actions": null,
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": "rgb(213, 213, 213)",
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		},
		{
			"id": "B3_8",
			"font_size": "medium",
			"label": "LOW",
			"image_id": "SCSH_FREIBAD",
			"load_board": {
				"id": "zAlggdnVis1cnnoJGydd",
				"name": null,
				"data_url": null,
				"url": null,
				"path": null
			},
			"actions": null,
			"bold": false,
			"label_at_bottom": false,
			"italic": false,
			"background_color": "rgb(213, 213, 213)",
			"border_color": null,
			"text_color": null,
			"vocalization": null,
			"top": null,
			"left": null,
			"width": null,
			"height": null
		}
	],
	"images": [
		{
			"id": "SCSH_GOHOME1",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FGOHOME1.png?alt=media&token=f845004d-5615-4882-b3f0-7901b980bf52",
			"symbol": {
				"set": "SCSH",
				"name": "GOHOME1.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_NATURE",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FNATURE.png?alt=media&token=78caadf0-287f-4ffe-acb7-9363c56bcd78",
			"symbol": {
				"set": "SCSH",
				"name": "NATURE.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_ARTSUPP~",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FARTSUPP~.png?alt=media&token=07b81f1a-02ca-4d7d-8c88-f82352afbcde",
			"symbol": {
				"set": "SCSH",
				"name": "ARTSUPP~.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_RED",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FRED.png?alt=media&token=5be29b7c-60d6-4541-9af1-31664d77bd76",
			"symbol": {
				"set": "SCSH",
				"name": "RED.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_ORANGE2",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FORANGE2.png?alt=media&token=99d03509-cbfc-4e40-b830-828fcbf9dc71",
			"symbol": {
				"set": "SCSH",
				"name": "ORANGE2.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_YELLOW",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FYELLOW.png?alt=media&token=23dfa5e5-5041-4376-ae29-b96596e7d4e7",
			"symbol": {
				"set": "SCSH",
				"name": "YELLOW.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_BROWN",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FBROWN.png?alt=media&token=892ea20e-99e8-4bf3-9da9-a2ea29f0edc1",
			"symbol": {
				"set": "SCSH",
				"name": "BROWN.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_BLUE",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FBLUE.png?alt=media&token=faea5fdc-1b5b-424e-a310-646b9ca0c2a9",
			"symbol": {
				"set": "SCSH",
				"name": "BLUE.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_down5_02",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2Fdown5_02.png?alt=media&token=f4f48e26-1b6a-41fb-b767-43cf39727d69",
			"symbol": {
				"set": "SCSH",
				"name": "down5_02.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_COLOR",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FCOLOR.png?alt=media&token=1fff9756-5fff-46e2-a7f5-44349f86c268",
			"symbol": {
				"set": "SCSH",
				"name": "COLOR.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_S_0B",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FS_0B.png?alt=media&token=6589f18c-8c36-44ac-b410-b055649cdc76",
			"symbol": {
				"set": "SCSH",
				"name": "S_0B.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_ING_0B",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FING_0B.png?alt=media&token=08eef084-0520-45fb-b9dd-0687edbadb59",
			"symbol": {
				"set": "SCSH",
				"name": "ING_0B.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_ED_0B",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FED_0B.png?alt=media&token=06f7d910-7416-4fdb-ac10-dba9a1569036",
			"symbol": {
				"set": "SCSH",
				"name": "ED_0B.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_TO_0B",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FTO_0B.png?alt=media&token=7783f644-7dc4-4717-aa7e-d8a6eaab8f4c",
			"symbol": {
				"set": "SCSH",
				"name": "TO_0B.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_MOUNTAIN",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FMOUNTAIN.png?alt=media&token=511434db-3140-42a7-8af3-4bfc239a127e",
			"symbol": {
				"set": "SCSH",
				"name": "MOUNTAIN.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_PAINT_M1",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FPAINT_M1.png?alt=media&token=9cb94d3e-ed67-4c27-b45c-97c6db072c71",
			"symbol": {
				"set": "SCSH",
				"name": "PAINT_M1.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_NOUNPL",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FNOUNPL.png?alt=media&token=97156b24-6b3d-4e83-915c-7d4da1c1e725",
			"symbol": {
				"set": "SCSH",
				"name": "NOUNPL.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_HIGH",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FHIGH.png?alt=media&token=065ceb8f-9d07-45f6-9359-6636f0b2f4e5",
			"symbol": {
				"set": "SCSH",
				"name": "HIGH.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_DRAW2A",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FDRAW2A.png?alt=media&token=da21c6b8-ae3d-447f-8d9f-3c0bc3ac3517",
			"symbol": {
				"set": "SCSH",
				"name": "DRAW2A.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_MORNING2",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FMORNING2.png?alt=media&token=8b94a37e-cf12-479e-8f11-f77a492efafd",
			"symbol": {
				"set": "SCSH",
				"name": "MORNING2.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_PAINT2",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FPAINT2.png?alt=media&token=b4b666a4-7091-4038-a15f-e348e7340ca1",
			"symbol": {
				"set": "SCSH",
				"name": "PAINT2.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_GET2",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FGET2.png?alt=media&token=c2bb20a8-4b25-4066-8239-eb598f5fc1ef",
			"symbol": {
				"set": "SCSH",
				"name": "GET2.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_CLEAR_EG",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FCLEAR_EG.png?alt=media&token=ad39c1d0-e27f-44ad-8032-bcd491c5f345",
			"symbol": {
				"set": "SCSH",
				"name": "CLEAR_EG.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_CUT1",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FCUT1.png?alt=media&token=0fe46f86-5e14-4cb1-b9ff-bf18cbeaa82f",
			"symbol": {
				"set": "SCSH",
				"name": "CUT1.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_NIGHT",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FNIGHT.png?alt=media&token=a2d63c36-f433-4935-81e0-f4ea515f2863",
			"symbol": {
				"set": "SCSH",
				"name": "NIGHT.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_RECYCLE",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FRECYCLE.png?alt=media&token=38f27459-82c5-4ffd-8158-3cb5d3fd2275",
			"symbol": {
				"set": "SCSH",
				"name": "RECYCLE.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		},
		{
			"id": "SCSH_FREIBAD",
			"width": 222,
			"height": 186,
			"url": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Ficon-sets%2FSCSH%2FFREIBAD.png?alt=media&token=ab0608e7-5055-493b-a8b6-c3f58d983806",
			"symbol": {
				"set": "SCSH",
				"name": "FREIBAD.png"
			},
			"content_type": "image/png",
			"license": null,
			"name": null
		}
	]
}

const DEBUG = (...args) => {
    console.log("%cOBEdit", "background: #334; font-weight: bold; color: rgb(255, 127, 76);", ...args)
}

const METAKEY = navigator.platform.includes("Mac") ? "⌘" : "Ctrl";

class Icon extends SvgPlus {
    #value = null;
    constructor(icon) {
        super("i-bw")
        this.#value = icon;
        this.toggleAttribute(icon, true);
    }
    set value(value) {
        this.toggleAttribute(this.#value, false)
        this.toggleAttribute(value, true);
        this.#value = value;
    }
}


// Editor -----------
function hideIfNoSelection({selection}) {
    this.toggleAttribute("disabled", selection.length === 0);
}
function onColorSelectionFunction(key) {
    /**
     * @param {OpenBoardEditor} editor
     */
    return function(editor) {
        const {selection} = editor;
        this.toggleAttribute("disabled", selection.length === 0); 
        this.icon.classList.remove("fill-unknown");
        this.icon.classList.remove("fill-transparent"); 

        let color = "#fffe";
        if (selection.length > 0) {
            let sColor = editor.getSelectionProperty(key);
            if (sColor === "transparent") {
                this.icon.classList.add("fill-transparent");
            }  else if (sColor === undefined) {
                color = "var(--c-darker)";
                this.icon.classList.add("fill-unknown");
            } else {
                color = sColor;
            }
        }
        this.icon.styles = {color};
    }
}
function onColorClickFunction(key) {
    /**
     * @param {OpenBoardEditor} editor
     */
    return async function(editor) {
       editor.pickColor(this, key);
    }
}
function toLabel(name, joiner = "\n") {
    return name.split(/(?=[A-Z])/).map(s => s[0].toUpperCase() + s.slice(1)).join(joiner);
}




const TOP_TOOLS = [
    {
        category: "content",
        binding: "c",
        tools: [
            {
                name: "copy",
                icon: "e-copy",
                binding: METAKEY + "c",
                onSelection: hideIfNoSelection,

                /** @param {OpenBoardEditor} editor */
                onClick(editor) {
                    editor.copy();
                }
            },
            {
                name: "paste",
                icon: "e-paste",
                binding: METAKEY + "v",
                onSelection(editor) {
                    this.toggleAttribute("disabled", !editor.canPaste || editor.selection.length === 0);
                },

                /** @param {OpenBoardEditor} editor */
                onClick(editor) {
                    editor.paste();
                }
            },
            {
                name: "pasteStyles",
                icon: "e-paste-b",
                binding: "Shift+" + METAKEY + "v",
                onSelection(editor) {
                    this.toggleAttribute("disabled", !editor.canPaste || editor.selection.length === 0);
                },

                /** @param {OpenBoardEditor} editor */
                onClick(editor) {
                    editor.paste(true);
                }
            },
            {
                name: "delete",
                icon: "e-delete",
                onSelection: hideIfNoSelection,
                async onClick(editor) { editor.clearSelectedButtons() }
            },
            "separator",
            {
                name: "editLabel",
                icon: "e-edit-text",
                onSelection: hideIfNoSelection,

                /** @param {OpenBoardEditor} editor */
                async onClick(editor) {
                    await editor.editLabel(editor.selection[0]);
                }
            },
            "separator",
            "imageList",
            {
                name: "findImage",
                icon: "e-image",
                onSelection: hideIfNoSelection,
                onClick(editor) {
                    editor.showImageFinder();
                }
            },
            {
                name: "deleteImage",
                icon: "e-delete-box",
                onSelection: hideIfNoSelection,

                /** @param {OpenBoardEditor} editor */
                onClick(editor) {
                    editor.setButtonImages(null);
                }
            }
        ]
    },
    {
        category: "styles",
        binding: "s",
        tools: [
            {
                name: "fill",
                icon: "e-fill",
                dropDown: true,
                onSelection: onColorSelectionFunction("background_color"),
                onClick: onColorClickFunction("background_color")
            },
            {
                name: "border",
                icon: "e-border",
                dropDown: true,
                onSelection: onColorSelectionFunction("border_color"),
                onClick: onColorClickFunction("border_color")
            },
            {
                name: "color",
                icon: "e-letter-b",
                dropDown: true,
                onSelection: onColorSelectionFunction("text_color"),
                onClick: onColorClickFunction("text_color")
            },
            "separator",
            {
                name: "size",
                icon: "e-letter-size-b",
                dropDown: true,
                onSelection: hideIfNoSelection,
                onClick(editor) {   
                    editor.pickFontSize(this, "font_size");
                }
            },
            {
                name: "bold",
                binding: METAKEY + "b",
                icon: "e-bold",

                /** @param {OpenBoardEditor} editor */
                onSelection(editor) {
                    this.toggleAttribute("selected", false);
                    if (editor.selection.length > 0) {
                        const bold = editor.getSelectionProperty("bold") ?? false;
                        this.toggleAttribute("selected", bold);
                    }
                    this.toggleAttribute("disabled", editor.selection.length == 0);
                },

                /** @param {OpenBoardEditor} editor */
                onClick(editor) {
                    this.toggleAttribute("selected", editor.toggleProperty("bold"));
                }

            },
            {
                name: "italic",
                icon: "e-italic",
                binding: METAKEY + "i",

                /** @param {OpenBoardEditor} editor */
                onSelection(editor) {
                    this.toggleAttribute("selected", false);
                    if (editor.selection.length > 0) {
                        const italic = editor.getSelectionProperty("italic") ?? false;
                        this.toggleAttribute("selected", italic);
                    }
                    this.toggleAttribute("disabled", editor.selection.length == 0);
                },

                /** @param {OpenBoardEditor} editor */
                onClick(editor) {
                    this.toggleAttribute("selected", editor.toggleProperty("italic"));
                }
            },
            "separator",
            {
                name: "labelPosition",
                icon: "e-label-at-top",
                onSelection(editor) {
                    this.toggleAttribute("disabled", editor.selection.length == 0);
                    let labelAtBottom = !!editor.getSelectionProperty("label_at_bottom");
                    this.icon.value = "e-label-at-" + (labelAtBottom ? "bottom" : "top")
                },
                onClick(editor) {
                    let labelAtBottom = editor.toggleProperty("label_at_bottom")
                    this.icon.value = "e-label-at-" + (labelAtBottom ? "bottom" : "top")
                }

            }
        ]
    },
    {
        category: "layout",
        binding: "l",
        tools: [
            {
                name: "insertLeft",
                icon: "e-insert-below",
                binding: METAKEY + "←",
                onSelection: hideIfNoSelection,
                iconTransform: "rotate(90deg)",
                

                /** @param {OpenBoardEditor} editor */
                onClick(editor) {editor.insertLeft()}
                
            },
            {
                name: "insertRight",
                icon: "e-insert-below",
                binding: METAKEY + "→",
                iconTransform: "rotate(-90deg)",
                onSelection: hideIfNoSelection,

                /** @param {OpenBoardEditor} editor */
                onClick(editor) {editor.insertRight()}
            },
            {
                name: "insertAbove",
                icon: "e-insert-below",
                binding: METAKEY + "↑",
                iconTransform: "rotate(180deg)",
                onSelection: hideIfNoSelection,

                /** @param {OpenBoardEditor} editor */
                onClick(editor) {editor.insertAbove()}
            },
            {
                name: "insertBelow",
                binding: METAKEY + "↓",
                icon: "e-insert-below",
                onSelection: hideIfNoSelection,

                /** @param {OpenBoardEditor} editor */
                onClick(editor) {editor.insertBelow()}
            },

            "separator",

            {
                name: "deleteRow",
                icon: "e-delete-row",

                /** @param {OpenBoardEditor} editor */
                onSelection(editor) {
                    this.toggleAttribute("disabled", !editor.canDeleteRows); 
                },


                /** @param {OpenBoardEditor} editor */
                onClick(editor) {
                    editor.deleteRows();
                }
            },

            {
                name: "deleteColumn",
                icon: "e-delete-row",
                iconTransform: "rotate(90deg)",

                /** @param {OpenBoardEditor} editor */
                onSelection(editor) {
                    this.toggleAttribute("disabled", !editor.canDeleteColumns); 
                },
                
                /** @param {OpenBoardEditor} editor */
                onClick(editor) {
                    editor.deleteColumns();
                }
            },

            "separator",

            {
                name: "merge",
                icon: "e-merge",
                binding: METAKEY + "m",

                /** @param {OpenBoardEditor} editor */
                onSelection(editor) {
                    this.toggleAttribute("disabled", !editor.canMerge); 
                },
                
                /** @param {OpenBoardEditor} editor */
                onClick(editor) {
                    editor.toggleMerge()
                }
            }

        ]
    },
]
const TOP_TOOLS_STATIC = [
    {
        name: "save",
        icon: "e-save"
    },
    {
        name: "undo",
        icon: "e-undo",
        binding: METAKEY + "Z",
        onSelection(editor) {
            this.toggleAttribute("disabled", !editor.canUndo());
        },
        onClick(editor) {
            editor.undo();
        }
        
    },
    { 
        name: "redo",
        icon: "e-redo",
        binding: "Shift+" + METAKEY + "Z",

        onSelection(editor) {
            this.toggleAttribute("disabled", !editor.canRedo());
        },
        onClick(editor) {
            editor.redo();
        }
    }
]
const KEY_BINDINGS = {
    /** 
     * @param {OpenBoardEditor} editor
     * */
    c(editor) {
        editor.selectCategory("content");
    },
    s(editor) {
        editor.selectCategory("styles");
    },
    l(editor) {
        editor.selectCategory("layout")
    },
    "Meta+c": (editor) => editor.copy(),
    "Meta+v": (editor) => editor.paste(),
    "Shift+Meta+v": (editor) => editor.paste(true),

    "Meta+b": (editor) => editor.toggleProperty("bold"),
    "Meta+i": (editor) => editor.toggleProperty("italic"),


    "Meta+ArrowLeft": (editor) => editor.insertLeft(),
    "Meta+ArrowRight": (editor) => editor.insertRight(),
    "Meta+ArrowUp": (editor) => editor.insertAbove(),
    "Meta+ArrowDown": (editor) => editor.insertBelow(),

    "Meta+z": (editor) => editor.undo(),
    "Meta+Shift+z": (editor) => editor.redo(),

    "Meta+m": (editor) => editor.toggleMerge(),
    "Shift+Meta+m": (editor) => editor.unMergeSelected(),


}



class ImageList extends FastFindImageList {
    /** @type {OpenBoardEditor} */
    editor = null;


    /**
     * @param {OpenBoardEditor} openBoardEditor
     */
    constructor(editor) {
        super();
        this.styles = {display: "contents"};
        this.editor = editor;
        editor.addImageList(this);
    }

    onImageSelected(image) {
        this.editor.setButtonImages(image);
    }

    /**
     * @param {OpenBoardEditor} editor
     */
    async onSelection(editor) {
        if (editor.selection.length == 1) {
            const label = editor.getSelectionProperty("label");
            this.search(label);
        }
    }
}

class FontSizeList extends SvgPlus {
    constructor(onSelect) {
        super("div");
        this.class = "selection-list";
        Object.keys(this.value2idx).map((k, i) => {
            let kCap = k[0].toUpperCase() + k.slice(1);
            this.createChild("div", {
                class: "b-bottom pad",
                events: {click: () => this.select(k)},
            }).createChild("span", {
                content: kCap, 
                styles: {"font-size": this.value2size[k]}
            })
        })
        this.onSelect = onSelect;
    }

    get value2idx() {
        return {
            "giant": 0,
            "huge": 1,
            "large": 2,
            "medium": 3,
            "small": 4,
            "tiny": 5
        }
    }
    get value2size() {
        return {
            "giant": "3em",
            "huge": "2.5em",
            "large": "2em",
            "medium": "1.5em",
            "small": "1em",
            "tiny": "0.75em"
        }
    }

    set value(value) {
        if (value !== undefined) {
            value = (value || "medium").toLowerCase();
            [...this.children].forEach((child, idx) => {
                child.toggleAttribute("selected", idx === this.value2idx[value]);
            });
        }
    }

    select(value) {
        this.onSelect(value);
    }
}

/**
 * Editor Input Tools
 */
class ToolIcon extends SvgPlus {
    #tool = null;
    #openBoardEditor = null;
    #onSelection = null;

    constructor(tool, openBoardEditor) {
        super("div");
        if (typeof tool === "string") {
            switch (tool) {
                case "separator":
                    this.class = "tool-separator";
                    break;
                case "imageList":
                    this.class = "image-list"
                    this.#tool = this.createChild(ImageList, {}, openBoardEditor);
                    this.#onSelection = (...args) => this.#tool.onSelection(...args)
                    // TODO:
                    break;
                case "styleList":
                    // TODO:
                    break;
            }
        } else {
            this.class = "tool-icon";
            this.props = {
                title: toLabel(tool.name, " ") + (tool.binding ? ` [${tool.binding}]` : "")
            }
            this.icon = this.createChild(Icon, {}, tool.icon);
            if (tool.iconTransform) {
                this.icon.styles = {transform: tool.iconTransform};
            }
            let labelText = toLabel(tool.name);
            let lines = labelText.split("\n").length;
            let label = this.createChild("div", {class: "label", content: labelText});
            if (tool.dropDown) {
                label.innerHTML += lines > 1 ? "" : "\n";
                label.createChild(Icon, {}, "down")
            }
            if (tool.onClick instanceof Function) {
                this.addEventListener("click", async e => {
                    let func = tool.onClick.bind(this)
                    let res = func(openBoardEditor, e);
                });
            }
            if (tool.onSelection instanceof Function) {
                this.#onSelection = tool.onSelection.bind(this);
            }
            this.#tool = tool;
        }
        this.#openBoardEditor = openBoardEditor;
    }

    get isSelectionUpdateable() {
        return this.#onSelection instanceof Function;
    }

    updateSelection(selection) {
        if (this.isSelectionUpdateable) {
            this.#onSelection(this.#openBoardEditor);
        }
    }
}
class GridTools extends SvgPlus {
    #selectionUpdaters = []
    constructor(openBoardEditor) {
        super("div");
        this.class = "editor-tools top";
        let topPanel = this.createChild("div", {class: "panel dark b-bottom"});
        this.selectionOptions = topPanel.createChild("div", {class: "selection-options"});


        let mainPanel = this.createChild("div", {class: "panel light tools b-bottom"});
        let staticTools = mainPanel.createChild("div", {class: "contents"});
        for (let tool of TOP_TOOLS_STATIC) {
            const toolEl = staticTools.createChild(ToolIcon, {}, tool, openBoardEditor);
            if (toolEl.isSelectionUpdateable) {
                this.#selectionUpdaters.push(toolEl);
            }
        }
        staticTools.createChild(ToolIcon, {}, "separator");

        let dynamicTools = mainPanel.createChild("div", {class: "contents"});
        for (let cat of TOP_TOOLS) {
            let catEl = this.selectionOptions.createChild("div", {
                class: "category pad b-right", 
                content: toLabel(cat.category),
                title: toLabel(cat.category, " ") + (cat.binding ? ` [${cat.binding}]` : ""),
                events: {click: () => this.selectCategory(cat.category)}
            });
           
            catEl.category = cat.category;

            let catTools = dynamicTools.createChild("div", {class: "contents"});
            for (let tool of cat.tools) {
                const toolEl = catTools.createChild(ToolIcon, {}, tool, openBoardEditor);
                if (toolEl.isSelectionUpdateable) {
                    this.#selectionUpdaters.push(toolEl);
                }
            }
            catTools.toggleAttribute("hidden", true);
            catTools.category = cat.category;
        }
        this.dynamicTools = dynamicTools;

        this.selectCategory(TOP_TOOLS[0].category);
    }

    createDropDown(tool, buttonLocations) {

    }

    selectCategory(category) {
        for (let catEl of this.selectionOptions.children) {
            catEl.toggleAttribute("selected", catEl.category === category);
        }
        for (let catTools of this.dynamicTools.children) {
            catTools.toggleAttribute("hidden", catTools.category !== category);
        }
        if (this.onCategorySelected instanceof Function) {  
            this.onCategorySelected(category);
        }
    }

    updateSelection(selection) {
        for (let toolIcon of this.#selectionUpdaters) {
            toolIcon.updateSelection(selection);
        }
    }

}



class SidePanel extends SvgPlus {
    constructor() {
        super("div");
        this.class = "panel side b-right";
        this.main = this.createChild("div", {class: "main b-right"});
        this.slider = this.createChild("div", {class: "slider"});
    }
}



class OpenBoardEditor extends ShadowElement {

    /** @type {OBBoardEditable} */
    #board = null;

    #dropDown = null;
    #dropDownPromise = null;
    #dropDownTool = null;

    #topTools = null;
    #buttonTools = null;
    #history = [];
    #historyIndex = 1;
    #coppiedButtons = [];
    #imageLists = [];
    #imageUpdateTimeout = null;
    constructor(el = "open-board-editor") {
        super(el, new SvgPlus("editor-root"));

        this.createChild("div", {class: "panel darker pad b-bottom centered", content: "OpenBoard Editor"});
        let tools = this.createChild(GridTools, {}, this)
        tools.onCategorySelected = (category) => {
            if (this.#dropDown) {
                this.#dropDown.select(undefined);
            }
        }

        let main = this.createChild("div", {class: "editor-main"});
        main.createChild(SidePanel);
        
        this.#board = OBBoardEditable.make(example)
       
        this.grid = main.createChild(AACEditorGrid, {}, this.#board);
        this.grid.onSelection = (ids) => {
            tools.updateSelection(ids);
            this.#updateDropDown();
        }   

        this.grid.onDoubleClick = (id) => {
            this.editLabel(id);
        }

        this.imageFinder = this.createChild(ImageFinder)
        this.imageFinder.onImageSelected = (image) => {
            this.setButtonImages(image);
            this.imageFinder.hide();
        }   

        tools.updateSelection(this.selection);

        window.addEventListener("keydown", async e => {
            const target = document.activeElement === this ? this.shadowRoot.activeElement :  document.activeElement;
            if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && !target.isContentEditable) {
                let key = e.key;
                if (e.metaKey || e.ctrlKey) {
                    key = "Meta+" + key;
                }
                if (e.altKey) {
                    key = "Alt+" + key;
                } 
                if (e.shiftKey) {
                    key = "Shift+" + key;
                }
                if (KEY_BINDINGS[key]) {
                    let res = KEY_BINDINGS[key](this);
                    e.preventDefault();
                }
            }
        });
        this.tools = tools;
        this.#updateBoard(true);
    }

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ UDPATE METHOD ~~~~~~~~~~~~~~~~~~~~~~~~~~ */
       
    #updateBoard(commitToHistory = true) {
        this.grid.board = this.#board;
        if (commitToHistory) {
            const lastState = this.#history[this.#historyIndex - 1];
            const state = JSON.stringify(this.#board);
            if (lastState !== state) {
                this.#history = this.#history.slice(0, this.#historyIndex);
                this.#history.push(state);
                this.#historyIndex = this.#history.length;
            }
        }
        this.tools.updateSelection(this.selection);
    }


    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ HELPER METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    /**
     * @param {string} key 
     * @return {any|undefined}
     */
    getSelectionProperty(key) {
        return this.#board.getSelectionProperty(this.selection, key);
    }

    /**
     * @returns {{rowRange: [number, number], colRange: [number, number]}}
     */
    getSelectionRange() {
        return this.#board.getSelectionRange(this.selection);
    }


    toggleProperty(prop, lastState) {
        const {selection} = this;
        const board = this.#board;
        let state = false;
        if (selection.length > 0) {
            const buttons = board.getButtonsByID(selection)
            const lastState = buttons.every(b => b[prop] === true);
            buttons.forEach(b => {
                b[prop] = !lastState;
            });
            state = !lastState;
            this.#updateBoard();
        }
        return state;
    }


    setSelectionProperty(prop, value) {
        const {selection} = this;
        if (selection.length > 0) {
            const buttons = this.#board.getButtonsByID(selection);
            buttons.forEach(b => { b[prop] = value; });
            this.#updateBoard();
        }
    }


    clearSelectedButtons() {
        let ids = this.selection;
        let buttons = this.#board.getButtonsByID(ids);
        buttons.forEach(b => b.clear())
        this.#updateBoard()
    }



    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ NAVIGATION ~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    selectCategory(category) {
        this.tools.selectCategory(category);
    }

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ IMAGE METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~ */


    addImageList(imageList) {
        this.#imageLists.push(imageList);
    }


    updateImageLists(value) {
        for (let imageList of this.#imageLists) {
            imageList.search(value);
        }
    }


    #triggerImageSearchUpdate(value) {
        if (this.#imageUpdateTimeout) {
            clearTimeout(this.#imageUpdateTimeout);
        }
        this.#imageUpdateTimeout = setTimeout(() => {
            this.updateImageLists(value);
            this.#imageUpdateTimeout = null;
        }, 500);
    }

  
    /**
     * Sets the image for all selected buttons to the specified image URL.
     * @param {string} image - The URL of the image to set for the selected buttons.
     */
    setButtonImages(image) {
        DEBUG("SET BUTTON IMAGES", image);
        if (this.selection.length > 0) {
            for (let buttonID of this.selection) {
                this.#board.setButtonImage(buttonID, image);
            }
            this.#updateBoard();
        }
    }


    showImageFinder() {
        let query = "";
        let imageList = this.#imageLists[0];
        if (imageList) {
            query = imageList.lastQuery || "";
        }
        this.imageFinder.search(query)
        this.imageFinder.show();
    }

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ DROP DOWN HELPERS ~~~~~~~~~~~~~~~~~~~~~~~~~~ */


    #updateDropDown() {
        if (this.#dropDown) {
            if (this.selection.length === 0) {
                this.#dropDown.destroy();
            } else {
                const newColor = this.#board.getSelectionProperty(this.selection, this.#dropDown.key);
                this.#dropDown.value = newColor || null;
            }
        }
    }

    /**
     * @param {Element} tool - The tool element that was clicked.
     * @param {string} key - The property key associated with the color picker.
     * @param {new (onSelect: () => any) => SvgPlus} dropDownClass - The CSS class to apply to the dropdown.
     * @return {Promise<string>} - A promise that resolves to the selected color value.
     */
    async #createDropDownPromise(tool, key, dropDownClass) {
        const value = await new Promise((r) => {
            this.#dropDownTool = tool;      

            // Create the dropdown and position it relative to the clicked tool
            let [pos, size] = this.tools.bbox;
            let toolY = size.add(pos).y - 1;
            let toolX = tool.bbox[0].x;
            const dropDown = this.createChild(dropDownClass, {
                styles: {
                    position: "absolute", 
                    top: `${toolY}px`, 
                    left: `${toolX}px`,
                    opacity: 0,
                },
            }, r);
            dropDown.classList.add("drop-down");
            this.#dropDown = dropDown;

             // Get the initial value from the selected buttons and set it to the dropdown
            const initialValue = this.#board.getSelectionProperty(this.selection, key);
            dropDown.value = initialValue;
            dropDown.key = key;


            // After rendering the drop down, check if it goes off-screen and 
            // adjust its position if necessary
            window.requestAnimationFrame(() => {
                if (this.#dropDown) {
                    let [pos, size] = dropDown.bbox;
                    let corner = size.add(pos);
                    if (pos.x < 0) pos.x = 0;
                    if (corner.x > window.innerWidth) pos.x = window.innerWidth - size.x;
                    if (pos.y < 0) pos.y = 0;
                    if (corner.y > window.innerHeight) pos.y = window.innerHeight - size.y;
                    dropDown.styles = {left: `${pos.x}px`, top: `${pos.y}px`};
                }
                dropDown.styles = {opacity: 1};
            });
        });

        // If a value was selected, apply it to all selected buttons
        if (value !== undefined) {
            this.setSelectionProperty(key, value);
        }

        if (this.#dropDown.destroy instanceof Function) {
            this.#dropDown.destroy();
        } else {
            this.#dropDown.remove();
        }

        this.#dropDown = null;
        this.#dropDownTool = null;

        return value;
    }

    async #createDropDown(tool, key, dropDownClass) {
        let lastTool = null;

        // If a color picker is already open, close it and wait
        // for it to finish closing before opening a new one.
        if (this.#dropDownPromise) {
            lastTool = this.#dropDownTool;
            if (this.#dropDown) {
                this.#dropDown.select(undefined);
            }
            await this.#dropDownPromise;
        }

        // If the last tool is different from the current tool, open a new color picker.
        if (lastTool !== tool) {
            this.#dropDownPromise = this.#createDropDownPromise(tool, key, dropDownClass);
            await this.#dropDownPromise;
        } 
    }

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ COLOR PICKER METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    /**
     * @param {Element} tool - The tool element that was clicked.
     * @param {string} key - The property key associated with the color picker.
     * @return {Promise<string>} - A promise that resolves to the selected color value.
     */
    async pickColor(tool, key) {
        await this.#createDropDown(tool, key, ColorPicker);
    }

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ FONT SIZE DROP DOWN ~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    async pickFontSize(tool, key) {
        await this.#createDropDown(tool, key, FontSizeList);
    }

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ COPY/PASTE METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    /**
     * @returns {boolean} - Returns true if there are copied buttons 
     * available for pasting, false otherwise.
     */
    get canPaste() {
        return this.#coppiedButtons.length > 0;
    }

    /**
     * Copies the currently selected buttons in the board and stores their 
     * data for later pasting.
     */
    copy() {
        this.#coppiedButtons = this.#board.getButtonsByID(this.orderedSelection).map(b => b.toJSON());
    }

    /**
     * Pastes the copied buttons onto the currently selected buttons in the board.
     */
    paste(onlyStyles = false) {
        const n = this.#coppiedButtons.length;
        if (n > 0) {
            let selectedButtons = this.#board.getButtonsByID(this.orderedSelection)
            if (selectedButtons.length > 0) {
                for (let i = 0; i < selectedButtons.length; i++) {
                    const ci = i % n;
                    const id = selectedButtons[i].id;
                    const copyValue = this.#coppiedButtons[ci]
                    if (onlyStyles) {
                        selectedButtons[i].assignStyles(copyValue)
                    } else {
                        selectedButtons[i].assign(copyValue);
                    }
                }
                this.#updateBoard();
            }
        }
    }



    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ LAYOUT METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    insertAbove() {
        let minRow = this.#board.getSelectionRange(this.selection).rowRange[0];
        this.#board.insertRow(minRow, true);
        this.#updateBoard()
    }
    insertBelow() {
       let maxRow = this.#board.getSelectionRange(this.selection).rowRange[1];
        this.#board.insertRow(maxRow, false);
        this.#updateBoard()
    }
    insertLeft() {
        let minCol = this.#board.getSelectionRange(this.selection).colRange[0];
        this.#board.insertColumn(minCol, true);
        this.#updateBoard();
    }
    insertRight() {
        let maxCol = this.#board.getSelectionRange(this.selection).colRange[1]
        this.#board.insertColumn(maxCol, false);
        this.#updateBoard();
    }


    get canDeleteRows() {
        let res = false;
        const {selection} = this;
        if (selection.length > 0) {
            const {rowRange: [s,e]} = this.#board.getSelectionRange(this.selection);
            res = e-s + 1 < this.#board.grid.rows;
        }
        return res;
    }
    
    deleteRows() {
        const {rowRange: [s,e]} = this.#board.getSelectionRange(this.selection);
        for (let r = e; r >= s; r--) {
            this.#board.deleteRow(r);
        }
        this.#updateBoard()
    }

    get canDeleteColumns() {
        let res = false;
        const {selection} = this;
        if (selection.length > 0) {
            const {colRange: [s,e]} = this.#board.getSelectionRange(this.selection);
            res = e-s + 1 < this.#board.grid.columns;
        }
        return res;
    }

    deleteColumns() {
        const {colRange: [s,e]} = this.#board.getSelectionRange(this.selection);
        for (let c = e; c >= s; c--) {
            this.#board.deleteColumn(c);
        }
        this.#updateBoard()
    }

    get canMerge() {
        let ids = this.orderedSelection;
        if (ids.length > 1) {
            return this.#board.canMerge(ids);
        } else {
            return false;
        }
    }

    toggleMerge() {
        let ids = this.orderedSelection;
        if (ids.length > 1) {
            let idsSet = new Set(ids);
            if (idsSet.size === 1) {
                this.unMergeSelected()
            } else {
                this.mergeSelected()
            }
        }
    }

    mergeSelected() {
        let ids = this.orderedSelection;
        if (this.#board.canMerge(ids)) {
            this.#board.merge(ids);
        }
        this.#updateBoard();
    }



    unMergeSelected() {
        for (let id of this.selection) {
            this.#board.unMerge(id);
        }
        this.#updateBoard();
    }

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ UNDO/REDO METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~ */


    canRedo() {
        return this.#historyIndex < this.#history.length - 1 && this.#history.length > 0;
    }

    redo() {
        if (this.#historyIndex < this.#history.length - 1) {    
            this.#historyIndex++;
            const state = JSON.parse(this.#history[this.#historyIndex]);
            this.#board = OBBoardEditable.make(state);

            this.#updateBoard(false);
        }   
    }

    canUndo() {
        return this.#historyIndex > 0 && this.#history.length > 1;
    }

    undo() {
        if (this.#historyIndex > 0) {
            this.#historyIndex -= 1;
            const state = JSON.parse(this.#history[this.#historyIndex-1]);
            this.#board = OBBoardEditable.make(state);
            this.#updateBoard(false);
        }
    }

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ EDIT LABEL METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~ */


    async editLabel(id) {
        let newValue = await this.grid.editLabel(id, (value) => {
            this.#triggerImageSearchUpdate(value);
        });
        if (newValue !== undefined) {
            this.#board.getButtonByID(id).label = newValue;
            this.#updateBoard();
        }
    }


    get boardRows() {
        return this.#board.grid.rows;
    }

    get boardColumns() {
        return this.#board.grid.columns;
    }

    // /**
    //  * @returns {OBBoardEditable}
    //  */
    // get board() {
    //     return this.#board;
    // }

    /**
     * @returns {string[]}
     */
    get selection() {
        return this.grid.selection;
    }


    get orderedSelection() {
        let selection = new Set(this.selection);
        let order = this.#board.grid.order.flat();
        return order.filter(id => selection.has(id));
    }


    static get usedStyleSheets() {
        return [
            ...AACBoard.usedStyleSheets,
            import.meta.resolve("./styles.css"),
            import.meta.resolve("../IconSearch/image-search.css"),
            import.meta.resolve("../../Assets/Icons/icons.css")
        ];
    }
}


export { OpenBoardEditor }