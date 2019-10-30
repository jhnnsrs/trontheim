//@flow
import type {Alias, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten2} from "./index";
import {Epic} from "redux-observable";
import {
    createHortenEpic,
    createHortenHelpers,
    createHortenModel,
    createHortenReducer,
    createHortenSelectors
} from "./creators";
import type {HaldenSelector} from "../halden";
import {createHaldenAction, createHaldenPassThroughEpicFromActions, createHaldenSelector} from "../halden";
import {Reducer} from "redux";
import {TOOL_NONE} from "react-svg-pan-zoom";
import type {HaldenActions} from "../oslo";

export type HortenCanvasModel = HortenModel &{
    postVectors: HaldenActions,
    selectTool: HaldenActions,
    setValue: HaldenActions,
    setShape: HaldenActions,
    setDrawState: HaldenActions,
    pushRoi: HaldenActions
}

export type HortenCanvasSelectors = HortenSelectors & {
    getInput: HaldenSelector,
    getDrawState: HaldenSelector
}

export type HortenCanvasHelpers = HortenHelpers & {}
export type HortenCanvasDefaultState = any

export type HortenCanvasDefinition = {
    type: HortenType,
    disableDraw: boolean,
}

export type HortenCanvas = {
    model: HortenCanvasModel,
    selectors: HortenCanvasSelectors,
    definition: HortenCanvasDefinition,
    helpers: HortenCanvasHelpers,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenCanvasDefaultState
}

export const createHortenCanvasModel = createHortenModel({
    // This is Mainly for the FlowDiagram Interoperability
    postVectors:  createHaldenAction("POST_VECTORS"),
    pushRoi:  createHaldenAction("PUSH_ROI"),
    selectTool:  createHaldenAction("SELECT_TOOL"),
    setValue:  createHaldenAction("SET_VALUE"),
    setShape:  createHaldenAction("SET_SHAPE"),
    setDrawState:  createHaldenAction("SET_DRAW_STATE"),
})

export const createHortenCanvasHelpers = createHortenHelpers({
    //TODO: make really okay
})

export const createHordenCanvasSelectors = createHortenSelectors({
    getInput: createHaldenSelector("input"),
    getDrawState: createHaldenSelector("drawState")
})



export const createHortenCanvasEpic =  createHortenEpic((model: HortenCanvasModel, selectors: HortenCanvasSelectors ) => ({

    postVectorsPassThrough: createHaldenPassThroughEpicFromActions(model.postVectors),
    setDrawStatePassThrough: createHaldenPassThroughEpicFromActions(model.setDrawState),
    selectToolPassThrough: createHaldenPassThroughEpicFromActions(model.selectTool),
    setValuePassThrough: createHaldenPassThroughEpicFromActions(model.setValue),
    setShapePassThrough: createHaldenPassThroughEpicFromActions(model.setShape),

}));

const defaultState = {
    drawState: true,
    viewerValue: null,
    viewerTool: TOOL_NONE
};

export const createHortenCanvasReducer =  createHortenReducer((model: HortenCanvasModel) => (
    {
        [model.selectTool.success.toString()]: (state, action) => {
            return { ...state, viewerTool: action.payload };
        },
        [model.setValue.success.toString()]: (state, action) => {
            return { ...state, viewerValue: action.payload };
        },
        [model.setShape.success.toString()]: (state, action) => {
            return { ...state, setShape: action.payload };
        },
        [model.setDrawState.success.toString()]: (state, action) => {
            return { ...state, drawState: action.payload };
        },

    })
);


export function createHortenCanvas(definition: HortenCanvasDefinition): ((Alias) => HortenCanvas) {
    let modelCreator = createHortenCanvasModel;
    let selectorsCreator = createHordenCanvasSelectors;
    let helperCreator = createHortenCanvasHelpers;
    let epicCreator = createHortenCanvasEpic;
    let reducerCreator = createHortenCanvasReducer;

    // Updating defaultState
    let state = defaultState
    if (definition.disableDraw) state = {...state, drawState: false}

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, state)
}