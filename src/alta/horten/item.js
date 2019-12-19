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
import {
    ABORTED,
    FAILURE,
    ITEMCREATED,
    ITEMDELETED,
    ITEMUPDATED,
    LOADED,
    LOADING,
    POSTED,
    POSTING,
    SET,
    SETTING
} from "../constants";
import {deletingFromStavangerList} from "../helpers";
import type {HaldenActions} from "../oslo";

export interface HortenItemModel<T> extends HortenModel  {
    fetchItem: HaldenActions<T>,
    postItem: HaldenActions<T>,
    updateItem: HaldenActions<T>,
    deleteItem: HaldenActions<T>,
    selectItem: HaldenActions<T>,
    setItem: HaldenActions<T>,
    osloItemUpdate: HaldenActions<T>,
    osloItemCreate: HaldenActions<T>,
    osloItemDelete: HaldenActions<T>,
    osloJoin: HaldenActions<T>,
    osloLeave: HaldenActions<T>,
}

export type HortenItemSelectors = HortenSelectors & {
    getData: HaldenSelector,
    getMeta: HaldenSelector,
    getInfo: HaldenSelector,
    getID: HaldenSelector,
}


export type HortenItemHelpers = HortenHelpers & {}


export type HortenItemDefaultState = {
    data: any,
    meta: { status: any, statuscode: any, error: any },
}

export type HortenItemDefinition = {
    type: HortenType,
    url: string

}

export interface HortenItem<T>  {
    model: HortenItemModel<T>,
    selectors: HortenItemSelectors,
    helpers: HortenItemHelpers,
    definition: HortenItemDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenItemDefinition,
    defaultState: HortenItemDefaultState
}

export const createHortenItemModel = createHortenModel({
    fetchItem: createHaldenAction("ITEM_FETCH"),
    postItem: createHaldenAction("ITEM_POST"),
    updateItem: createHaldenAction( "ITEM_UPDATE"),
    deleteItem: createHaldenAction( "ITEM_DELETE"),
    selectItem: createHaldenAction( "ITEM_SELECT"),
    setItem: createHaldenAction( "ITEM_SET"),
    // TODO: Right now List do not match the logic of the Detail when it comes to subscription aliases alias + "-" + type should be set here
    osloItemUpdate: createHaldenAction( "ITEM_OSLO_UPDATE"),
    osloItemDelete: createHaldenAction( "ITEM_OSLO_DELETE"),
    osloItemCreate: createHaldenAction( "ITEM_OSLO_CREATE"),
    osloJoin: createHaldenAction( "JOIN_ROOM"),
    osloLeave: createHaldenAction( "LEAVE_ROOM"),
})

export const createHortenItemHelpers = createHortenHelpers()

export const createHortenItemSelectors = createHortenSelectors({
    getData: createHaldenSelector("data"),
    getMeta: createHaldenSelector("meta"),
    getID: createHaldenFunctionSelector((state) => state.data ? state.data.id : null),
})


export const createHortenItemEpic = createHortenEpic((model: HortenItemModel, selectors: HortenItemSelectors) => ({
    selectPassThrough: createHaldenPassThroughEpicFromActions(model.selectItem),
    setItemPassThrough: createHaldenPassThroughEpicFromActions(model.setItem),
    osloItemCreatePassThrough: createHaldenPassThroughEpicFromActions(model.osloItemCreate),
    osloItemDeletePassThrough: createHaldenPassThroughEpicFromActions(model.osloItemDelete),
    osloItemUpdatePassThrough: createHaldenPassThroughEpicFromActions(model.osloItemUpdate),
}));


const defaultState = {
    data: null,
    meta: null,
    postedItem: null,
    newItem: null,
    deletedItem: null
};

export const createHortenItemReducer = createHortenReducer((hortenDetailModel: HortenItemModel) => (
    {
        // LIST OPTIONS
        [hortenDetailModel.fetchItem.request]: (state, action) => {
            return { ...state, meta:{...state.meta, loading: true, status: LOADING}};
        },
        [hortenDetailModel.fetchItem.success]: (state, action) => {
            return { ...state, data: action.payload.data, meta: {...state.meta, loading: false, status: LOADED}};
        },
        [hortenDetailModel.fetchItem.failure]: (state, action) => {
            let error = action.payload.detail
            return { ...state, meta: {...state.meta, error:error, loading:false, status: FAILURE}};
        },
        [hortenDetailModel.fetchItem.abort]: (state, action) => {
            return { ...state, meta: {...state.meta, error:null, loading: false, status: ABORTED}};
        },


        // CREATE OPTIONS
        [hortenDetailModel.postItem.request]: (state, action) => {
            return {...state, postedItem: {...state. postedItem, meta : {loading: true, status: POSTING}}, meta: {...state.meta, status: POSTING}}
        },
        [hortenDetailModel.postItem.success]: (state, action) => {
            return {...state, meta: {...state.meta, status: POSTED}, postedItem: {data:action.payload, meta : {error:null, loading: false,  status: POSTED}}}
        },
        [hortenDetailModel.postItem.failure]: (state, action) => {
            let error = action.payload.detail
            return {...state, meta: {...state.meta, error:error, loading:false, status: FAILURE}, postedItem: {data:null, meta : {...state.meta, error:error, loading: false, status: FAILURE}}}
        },
        [hortenDetailModel.postItem.abort]: (state, action) => {
            return {...state, meta: {...state.meta, status: ABORTED}, postedItem:{data:null, meta : {...state.meta,  status: ABORTED}}}
        },

        // SET OPTIONS
        [hortenDetailModel.setItem.request]: (state, action) => {
            return { ...state, meta:{...state.meta, loading: true, status: SETTING}};
        },
        [hortenDetailModel.setItem.success]: (state, action) => {
            return { ...state, data: action.payload.data, meta: {...state.meta, loading: false, status: SET}};
        },
        [hortenDetailModel.setItem.failure]: (state, action) => {
            let error = action.payload.detail
            return { ...state, meta: {...state.meta, error:error, loading:false, status: FAILURE}};
        },
        [hortenDetailModel.setItem.abort]: (state, action) => {
            return { ...state, meta: {...state.meta, error:null, loading: false, status: ABORTED}};
        },


        // DELETE OPTIONS
        [hortenDetailModel.deleteItem.request]: (state, action) => {
            let newlist = deletingFromStavangerList(state.data,action.payload)
            return {...state, data:  newlist , deletedItem: {...state.deletedItem, meta: {...state.deletedItem.meta, loading:true }}}
        },
        [hortenDetailModel.deleteItem.success]: (state, action) => {
            // This should online update if it is called by the OSLO backend?
            return state;
            //return {...state, deletedItem: {item: action.payload, error:null, loading: false}}
        },
        [hortenDetailModel.deleteItem.failure]: (state, action) => {
            let error = action.payload.detail
            return {...state, meta: {...state.meta, error:error, loading:false, status: FAILURE}, deletedItem: {item:null, error:error, loading: false}}
        },
        [hortenDetailModel.deleteItem.abort]: (state, action) => {
            return {...state, deletedItem:{item:null, error:null, loading: false}}
        },

        // OSLO SYNC OPTIONS
        [hortenDetailModel.osloItemDelete.success]: (state, action) => {
            //
            return {
                ...state, data: null, meta: {...state.meta, error: null, loading: false, status: ITEMDELETED(action.payload)},
                deletedItem: state.data
            }
        }
        ,
        [hortenDetailModel.osloItemCreate.success]: (state, action) => {

            let item = action.payload.data;
            console.log(item)
            return {
                ...state, data: item, meta: {...state.meta, status: ITEMCREATED(action.payload)}
            }
        },
        [hortenDetailModel.osloItemUpdate.success]: (state, action) => {

            let item = action.payload.data;
            console.log(item)
            return {
                ...state, data: item , meta: {...state.meta, status: ITEMUPDATED(action.payload)}
            }
        },
    })
);

export function createHortenItem<M>(definition: HortenItemDefinition): ((Alias) => HortenItem<M>) {
    let modelCreator = createHortenItemModel;
    let selectorsCreator = createHortenItemSelectors;
    let helperCreator = createHortenItemHelpers;
    let epicCreator = createHortenItemEpic;
    let reducerCreator = createHortenItemReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}