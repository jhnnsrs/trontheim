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
import type {HaldenActions} from "../oslo";
import {isUndefined} from "redux-actions/lib/utils/isUndefined";

export type HortenEdgeModel = HortenModel & {
    setOutput: HaldenActions,
    setInput: HaldenActions,
    setModel: HaldenActions,
    pop: HaldenActions, //For the Node that causes the Pop
    unpop: HaldenActions, //For the Node that causes the Pop
    alienate: HaldenActions, //For the Node that causes the Pop
    homecoming: HaldenActions, //For the Node that causes the Pop
    setIsPopped: HaldenActions, //For the Node that has been opened
    setIsAlien: HaldenActions, //For the Node that has been opened
    setProgress: HaldenActions,
    setStatus: HaldenActions,
    requireUser: HaldenActions,
    fetchLinks: HaldenActions
}

export type HortenEdgeSelectors = HortenSelectors & {
    getLinks: HaldenSelector,
    hasPopped: HaldenSelector,
    isPopped: HaldenSelector,
    isAlien: HaldenSelector,
    hasAlien: HaldenSelector,
    getInput: HaldenSelector

}


export type HortenEdgeHelpers = HortenHelpers & {}


export type HortenEdgeDefaultState = {
    [string]: any
}


export type EdgeMap = {
    in: string,
    map: string,
}

export type HortenEdgeDefinition = {
    isPoppable: boolean | isUndefined,
    isAlienable: boolean | isUndefined,
    type: HortenType,
    ins: Array<EdgeMap>

}

export type HortenEdge = {
    model: HortenEdgeModel,
    selectors: HortenEdgeSelectors,
    helpers: HortenEdgeHelpers,
    definition: HortenEdgeDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenEdgeDefaultState
}


export const createHortenEdgeModel = createHortenModel({
    setInput: createHaldenAction("SET_INPUT"),
    setOutput: createHaldenAction("SET_OUTPUT"),
    fetchLinks: createHaldenAction("FETCH_LINKS"),
    setModel: createHaldenAction("SET_MODEL"),
    setProgress: createHaldenAction("UPDATE_FIELD"),
    setStatus: createHaldenAction("SET_STATUS"),
    pop: createHaldenAction("SET_POPPED"),
    unpop: createHaldenAction("SET_UNPOPPED"),
    alienate: createHaldenAction("SET_ALIEN"),
    homecoming: createHaldenAction("SET_HOME"),
    setIsPopped: createHaldenAction("SET_IS_POPPED"),
    setIsAlien: createHaldenAction("SET_IS_ALIEN"),
    requireUser: createHaldenAction("REQUIRE_USER"),
})

export const createHortenEdgeHelpers = createHortenHelpers()

export const createHortenEdgeSelectors = createHortenSelectors({
    getInput: createHaldenSelector("input"),
    isPopped: createHaldenSelector("isPopped"), //For the Node that is being Popped
    hasAlien: createHaldenSelector("hasAlien"), //For the Node that causes the Pop
    isAlien: createHaldenSelector("isAlien"), //For the Node that causes the Pop
    hasPopped: createHaldenSelector("hasPopped"), //For the Node that causes the Pop
    getLinks: createHaldenSelector("links")
})


export const createHortenEdgeEpic = createHortenEpic((model: HortenEdgeModel, selectors: HortenEdgeSelectors) => ({
        progressPassThrough: createHaldenPassThroughEpicFromActions(model.setProgress),
        requireUserThrough: createHaldenPassThroughEpicFromActions(model.requireUser),
        setModelPassThrough: createHaldenPassThroughEpicFromActions(model.setModel),
        setStatePassThrough: createHaldenPassThroughEpicFromActions(model.setStatus),
        // No Fetch links Passthrough because it is handled by the Graph
}));


const defaultState = {
    nodeid: false,
    color: "#ff00FF",
    attention: false,
    touched: false,
    hallo: false,
    links: null,
    popurl: null,
    progress: null,
    isPopped: null,
    isAlien: null, // This will be set to the channelID it should listen on
    hasPopped: false,
    isPoppable: false,
    isAlienable: false,
    status: 999,
};

export const createHortenEdgeReducer = createHortenReducer((model: HortenEdgeModel) => (
    {
        [model.setProgress.success]: (state, action) => {
            return {...state, progress: action.payload}

        },
        [model.fetchLinks.success]: (state, action) => {
            return {...state, links: action.payload}

        },
        [model.setModel.success]: (state, action) => {
            return {...state, ...action.payload}
        },
        [model.setStatus.success]: (state, action) => {
            return {...state, status: action.payload}
        },
        [model.pop.success]: (state, action) => {
            return {...state, hasPopped: action.payload}
        },
        [model.unpop.success]: (state, action) => {
            return {...state, hasPopped: false}
        },
        [model.alienate.success]: (state, action) => {
            return {...state, hasAlien: action.payload}
        },
        [model.homecoming.success]: (state, action) => {
            return {...state, hasAlien: false}
        },
        [model.setIsAlien.success]: (state, action) => {
            return {...state, isAlien: action.payload}
        },
        [model.setIsPopped.success]: (state, action) => {
            return {...state, isPopped: action.payload}
        },
        [model.requireUser.success]: (state, action) => {
            return {...state, attention: action.payload}

        },
    })
);

export function createHortenEdge(definition: HortenEdgeDefinition): ((Alias) => HortenEdge) {
    let modelCreator = createHortenEdgeModel;
    let selectorsCreator = createHortenEdgeSelectors;
    let helperCreator = createHortenEdgeHelpers;
    let epicCreator = createHortenEdgeEpic;
    let reducerCreator = createHortenEdgeReducer;

    let newdefaultState = {...defaultState, isPoppable: definition.isPoppable, isAlienable: definition.isAlienable}

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, newdefaultState)
}