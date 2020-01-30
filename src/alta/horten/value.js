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
import {
    createHaldenAction,
    createHaldenFunctionSelector,
    createHaldenPassThroughEpicFromActions,
    createHaldenSelector
} from "../halden";
import {Reducer} from "redux";
import {ABORTED, FAILURE, SET, SETTING} from "../constants";
import type {HaldenActions} from "../oslo";

export interface HortenValueModel<T> extends HortenModel  {
    setItem: HaldenActions<T>,
}

export type HortenValueSelectors = HortenSelectors & {
    getData: HaldenSelector,
    getMeta: HaldenSelector,
    getInfo: HaldenSelector,
    getID: HaldenSelector,
}


export type HortenValueHelpers = HortenHelpers & {}


export type HortenValueDefaultState = {
    data: any,
    meta: { status: any, statuscode: any, error: any },
}

export type HortenValueDefinition = {
    type: HortenType,
    url: string

}

export interface HortenValue<T>  {
    model: HortenValueModel<T>,
    selectors: HortenValueSelectors,
    helpers: HortenValueHelpers,
    definition: HortenValueDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenValueDefinition,
    defaultState: HortenValueDefaultState
}

export const createHortenValueModel = createHortenModel({
    setItem: createHaldenAction( "ITEM_SET"),
})

export const createHortenValueHelpers = createHortenHelpers()

export const createHortenValueSelectors = createHortenSelectors({
    getData: createHaldenSelector("data"),
    getMeta: createHaldenSelector("meta"),
    getID: createHaldenFunctionSelector((state) => state.data ? state.data.id : null),
})


export const createHortenValueEpic = createHortenEpic((model: HortenValueModel, selectors: HortenValueSelectors) => ({
    setItemPassThrough: createHaldenPassThroughEpicFromActions(model.setItem),
}));


const defaultState = {
    data: null,
    meta: null,
    postedItem: null,
    newItem: null,
    deletedItem: null
};

export const createHortenValueReducer = createHortenReducer((hortenDetailModel: HortenValueModel) => (
    {

        // SET OPTIONS
        [hortenDetailModel.setItem.request]: (state, action) => {
            return { ...state, meta:{...state.meta, loading: true, status: SETTING}};
        },
        [hortenDetailModel.setItem.success]: (state, action) => {
            return { ...state, data: action.payload.data, meta: {...state.meta, loading: false, status: SET}};
        },
        [hortenDetailModel.setItem.failure]: (state, action) => {
            let error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
            return { ...state, meta: {...state.meta, error:error, loading:false, status: FAILURE}};
        },
        [hortenDetailModel.setItem.abort]: (state, action) => {
            return { ...state, meta: {...state.meta, error:null, loading: false, status: ABORTED}};
        },

    })
);

export function createHortenValue<M>(definition: HortenValueDefinition): ((Alias) => HortenValue<M>) {
    let modelCreator = createHortenValueModel;
    let selectorsCreator = createHortenValueSelectors;
    let helperCreator = createHortenValueHelpers;
    let epicCreator = createHortenValueEpic;
    let reducerCreator = createHortenValueReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}