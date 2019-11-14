//@flow
import type {Alias, Horten, HortenModel, HortenSelectors, HortenType, Props, State} from "./types";
import {Reducer} from "redux";
import {ABORTED, ITEMCREATED, ITEMDELETED, ITEMUPDATED, LOADED} from "../constants";
import {
    createOsloPassThroughEpic,
    deletedFromStavangerList,
    deletingFromStavangerList,
    expandFromOslo,
    pushToStavangerList,
    updateStavangerList
} from "../helpers";
import {Epic} from "redux-observable";
import {createHorten2} from "./index";
import type {HaldenActions} from "../oslo";
import {createHortenEpic, createHortenModel, createHortenReducer} from "./creators";
import {createHaldenAction} from "../halden";


export type HortenModelUrl = string

export type HortenTableDefinition = {
    type: HortenType,
    url: string
}

// MASHED
export type HortenListModel = HortenModel & {
    fetchList: HaldenActions,
    fetchItem: HaldenActions,
    postItem: HaldenActions,
    updateItem: HaldenActions,
    deleteItem: HaldenActions,
    selectItem: HaldenActions,
    setList: HaldenActions,
    addToList: HaldenActions,
    osloItemUpdate: HaldenActions,
    osloItemCreate: HaldenActions,
    osloItemDelete: HaldenActions,
    osloJoin: HaldenActions,
    osloLeave: HaldenActions,
}

export type HortenListSelectors = HortenSelectors & {
    getData: (State,Props) => any,
    getList: (State,Props) => any,
    getMeta: (State,Props) => any,
    getDeleted: (State,Props) => any,
    getSelected: (State,Props) => any,
    getNew: (State,Props) => any,
    getModel: (State,Props) => any,
    getProps: (State,Props) => Props,

}

export type HortenListHelper = {
    [string]: any
}

export type HortenListDefaultState = {
    data: any[],
    meta: { status: any, statuscode: any, error: any },
    newItem: { data: any, meta: { error: any, status: any } },
    deletedItem: { data: any, meta: { error: any, status: any } }
}


// Basic Table
export type HortenTable = Horten & {
    model: HortenListModel,
    selectors: HortenListSelectors,
    helpers: HortenListHelper,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    definition: HortenTableDefinition,
    type: HortenType,
    defaultState: HortenListDefaultState
}


export const defaultState = {
    data: [],
    meta: { status: null, statuscode: null, error: null},
    newItem: { data: null, meta: {error: null, status: null}},
    deletedItem: { data: null, meta: {error: null, status: null}},
    selectedItem: { data: null, meta: {error: null, status: null}},
};


export const createHortenListModel = createHortenModel({
    fetchList: createHaldenAction( "LIST_FETCH"),
    setList: createHaldenAction( "LIST_SET"),
    fetchItem: createHaldenAction("ITEM_FETCH"),
    postItem: createHaldenAction("ITEM_POST"),
    updateItem: createHaldenAction( "ITEM_UPDATE"),
    deleteItem: createHaldenAction( "ITEM_DELETE"),
    selectItem: createHaldenAction( "ITEM_SELECT"),
    addToList: createHaldenAction( "ADD_TO_LIST"),
    // TODO: Right now List do not match the logic of the Detail when it comes to subscription aliases alias + "-" + type should be set here
    osloItemUpdate: createHaldenAction( "ITEM_OSLO_UPDATE"),
    osloItemDelete: createHaldenAction( "ITEM_OSLO_DELETE"),
    osloItemCreate: createHaldenAction( "ITEM_OSLO_CREATE"),
    osloJoin: createHaldenAction( "JOIN_ROOM"),
    osloLeave: createHaldenAction( "LEAVE_ROOM"),
})



export const createHortenListSelectors = (alias: Alias, type: HortenType) => ({
    getData: (state: State, props: Props) => state[alias][type].data,
    getList: (state: State, props: Props) => state[alias][type].data,
    getMeta: (state: State, props: Props) => state[alias][type].meta,
    getDeleted: (state: State, props: Props) => state[alias][type].deletedItem,
    getSelected: (state: State, props: Props) => state[alias][type].selectedItem,
    getNew: (state: State, props: Props) => state[alias][type].newItem,
    getModel: (state: State, props: Props) => {return state[alias][type]},
    getProps: (state: State, props: Props) => {return props}
});


export const createHortenListHelper = (alias: Alias, type: HortenType) => null

export const createHortenListEpic = createHortenEpic((hortenListModel: HortenListModel, hortenListSelector: HortenListSelectors) => ({
        selectPassThrough: createOsloPassThroughEpic(hortenListModel.selectItem),
        setListPassThrough: createOsloPassThroughEpic(hortenListModel.setList),
        addListPassThrough: createOsloPassThroughEpic(hortenListModel.addToList),
        osloItemDeletePassThrough: createOsloPassThroughEpic(hortenListModel.osloItemDelete),
        osloItemCreatePassThrough: createOsloPassThroughEpic(hortenListModel.osloItemCreate),
        osloItemUpdatePassThrough: createOsloPassThroughEpic(hortenListModel.osloItemUpdate)
}))

export const createHortenListReducer = createHortenReducer( (hortenListModel: HortenListModel) => ({
        // LIST OPTIONS
        [hortenListModel.fetchList.request]: (state, action) => {
            return { ...state, data: [], meta: {error: null, loading: true}};
        },
        [hortenListModel.fetchList.success]: (state, action) => {
            let datalist = []
            action.payload.data.forEach( item =>  {
                datalist.push({data: item, meta: {status: LOADED, loading: false, error: null}})
            });
            return { ...state, data: datalist, meta: {...state.meta, loading:false, error: null} };
        },
        [hortenListModel.fetchList.failure]: (state, action) => {
            let error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
            return { ...state, meta: { ...state.meta, error: error, loading: false} };
        },
        [hortenListModel.fetchList.abort]: (state, action) => {
            return { ...state, meta: { ...state.meta, error: ABORTED, loading: false} };
        },

        //SET LIST OPTIONS
        [hortenListModel.setList.request]: (state, action) => {
            return { ...state, data: [], meta: {error: null, loading: true}};
        },
        [hortenListModel.setList.success]: (state, action) => {
            let datalist = []
            action.payload.forEach( item =>  {
                datalist.push({data: item.data, meta: {status: LOADED, loading: false, error: null}})
            });
            return { ...state, data: datalist, meta: {...state.meta, loading:false, error: null} };
        },
        [hortenListModel.setList.failure]: (state, action) => {
            let error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
            return { ...state, meta: { ...state.meta, error: error, loading: false} };
        },
        [hortenListModel.setList.abort]: (state, action) => {
            return { ...state, meta: { ...state.meta, error: ABORTED, loading: false} };
        },

        //ADD TO LIST OPTIONS
        [hortenListModel.addToList.request]: (state, action) => {
            return { ...state};
        },
        [hortenListModel.addToList.success]: (state, action) => {
            let datalist = [...state.data]
            datalist.push(action.payload)
            return { ...state, data: [...datalist], meta: {...state.meta, loading:false, error: null} };
        },

        // CREATE OPTIONS
        [hortenListModel.postItem.request]: (state, action) => {
            return {...state, newItem: {...state.newItem, meta : {loading: true}}}
        },
        [hortenListModel.postItem.success]: (state, action) => {
            return {...state, newItem: {data: action.payload.response, meta : {error:null, loading: false, status: action.payload.status}}}
        },
        [hortenListModel.postItem.failure]: (state, action) => {
            let error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
            return {...state, newItem: {data:null, meta : { error:error, loading: false}}}
        },
        [hortenListModel.postItem.abort]: (state, action) => {
            return {...state,  newItem:{data:null, meta : {error:null, loading: false}}}
        },

        // SELECT OPTIONS
        [hortenListModel.selectItem.success]: (state, action) => {
            return {...state, selectedItem: {data: action.payload.data, meta : {error:null, loading: false}}}
        },

        // DELETE OPTIONS
        [hortenListModel.deleteItem.request]: (state, action) => {
            let newlist = deletingFromStavangerList(state.data,action.payload)
            return {...state, data:  newlist , deletedItem: {...state.deletedItem, meta: {...state.deletedItem.meta, loading:true }}}
        },
        [hortenListModel.deleteItem.success]: (state, action) => {
            // This should online update if it is called by the OSLO backend?
            return state;
            //return {...state, deletedItem: {item: action.payload, error:null, loading: false}}
        },
        [hortenListModel.deleteItem.failure]: (state, action) => {
            let error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
            return {...state, deletedItem: {item:null, error:error, loading: false}}
        },
        [hortenListModel.deleteItem.abort]: (state, action) => {
            return {...state,  deletedItem:{item:null, error:null, loading: false}}
        },

        // OSLO SYNC OPTIONS
        [hortenListModel.osloItemDelete.success]: (state, action) => {
            //
            let newlist = deletedFromStavangerList(state.data, action.payload);
            return {
                ...state, data: newlist, meta: {...state.meta, error: null, loading: false, status: ITEMDELETED(action.payload)},
                deletedItem: expandFromOslo(action.payload)
            }
        }
        ,
        [hortenListModel.osloItemCreate.success]: (state, action) => {

            let newlist = pushToStavangerList(state.data, action.payload);
            return {
                ...state, data: newlist, meta: {...state.meta, error: null, loading: false, status: ITEMCREATED(action.payload)},
                newItem: expandFromOslo(action.payload)
            }
        },
        [hortenListModel.osloItemUpdate.success]: (state, action) => {
            let newlist = updateStavangerList(state.data, action.payload);
            return {
                ...state, data: newlist, meta: {...state.meta, error: null, loading: false, status: ITEMUPDATED(action.payload)},
                newItem: expandFromOslo(action.payload)
            }
        },

    })
);





export function createHortenTable(definition: HortenTableDefinition): ((Alias) => HortenTable) {
    let modelCreator = createHortenListModel;
    let selectorsCreator = createHortenListSelectors;
    let helperCreator = createHortenListHelper;
    let epicCreator = createHortenListEpic;
    let reducerCreator = createHortenListReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}
