//@flow
import type {Alias, Horten, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
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

export type HortenFabricModel = HortenModel & {
    postVectors: HaldenActions,
    selectTool: HaldenActions,
    setValue: HaldenActions,
    pushRoi: HaldenActions,
    pushMask: HaldenActions,
}

export type HortenFabricSelectors = HortenSelectors & {
    getInput: HaldenSelector
}


export type HortenFabricHelpers = HortenHelpers & {}


export type HortenFabricDefaultState = {
    viewerValue: any,
    viewerTool: number
}

export type HortenFabricDefinition = {
    type: HortenType,

}

export type HortenFabric = Horten &{
    model: HortenFabricModel,
    selectors: HortenFabricSelectors,
    helpers: HortenFabricHelpers,
    definition: HortenFabricDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenFabricDefinition,
    defaultState: HortenFabricDefaultState
}

export const createHortenFabricModel = createHortenModel({
    postVectors:  createHaldenAction("POST_VECTORS"),
    pushRoi:  createHaldenAction("PUSH_ROI"),
    selectTool:  createHaldenAction("SELECT_TOOL"),
    setValue:  createHaldenAction("SET_VALUE"),
})

export const createHortenFabricHelpers = createHortenHelpers()

export const createHortenFabricSelectors = createHortenSelectors({
    getInput: createHaldenSelector("input")
})


export const createHortenFabricEpic = createHortenEpic((model: HortenFabricModel, selectors: HortenFabricSelectors) => ({
    postVectorsPassThrough: createHaldenPassThroughEpicFromActions(model.postVectors),
}));


const defaultState = {
    viewerValue: null,
    viewerTool: TOOL_NONE
};

export const createHortenFabricReducer = createHortenReducer((model: HortenFabricModel) => (
    {
        [model.selectTool.success.toString()]: (state, action) => {
            return { ...state, viewerTool: action.payload };
        },
        [model.setValue.success.toString()]: (state, action) => {
            return { ...state, viewerValue: action.payload };
        },
    }
    )
);

export function createHortenFabric(definition: HortenFabricDefinition): ((Alias) => HortenFabric) {
    let modelCreator = createHortenFabricModel;
    let selectorsCreator = createHortenFabricSelectors;
    let helperCreator = createHortenFabricHelpers;
    let epicCreator = createHortenFabricEpic;
    let reducersCreator = createHortenFabricReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducersCreator, defaultState)
}