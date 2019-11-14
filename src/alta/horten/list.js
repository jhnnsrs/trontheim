//@flow
import type {Alias, HortenApiCall, HortenModel, HortenType, Props, State} from "./types";
import * as qs from "querystring";
import {ajax} from "rxjs/ajax";
import {Reducer} from "redux";
import handleActions from "redux-actions/es/handleActions";
import {ABORTED, ITEMCREATED, ITEMDELETED, ITEMUPDATED, LOADED} from "../constants";
import {
    createOsloApiEpic,
    createOsloJoinRoomEpic,
    createOsloPassThroughEpic,
    deletedFromStavangerList,
    deletingFromStavangerList,
    expandFromOslo,
    getHeader,
    getRootUrl,
    pushToStavangerList,
    updateStavangerList
} from "../helpers";
import {combineEpics, Epic} from "redux-observable";
import {createHorten} from "./index";
import type {HaldenActions} from "../oslo";
import {createHortenApi, createHortenModel} from "./creators";
import {createHaldenAction, createHaldenApi} from "../halden";


export type HortenModelUrl = string

// MASHED
export type HortenListModel = HortenModel & {
    fetchList: HaldenActions,
    fetchItem: HaldenActions,
    postItem: HaldenActions,
    postItemFromForm: HaldenActions,
    updateItem: HaldenActions,
    deleteItem: HaldenActions,
    selectItem: HaldenActions,
    osloItemUpdate: HaldenActions,
    osloItemCreate: HaldenActions,
    osloItemDelete: HaldenActions,
    osloJoin: HaldenActions,
    osloLeave: HaldenActions,
}

export type HortenListApi = {
    fetchList: HortenApiCall,
    fetchItem: HortenApiCall,
    postItem: HortenApiCall,
    deleteItem: HortenApiCall,
    postItemFromForm: HortenApiCall,
    updateItem: HortenApiCall,

}

export type HortenListSelectors = {
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


// Basic List
export type HortenList = {
    model: HortenListModel,
    selectors: HortenListSelectors,
    api: HortenListApi,
    helpers: HortenListHelper,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenListDefaultState
}


export const defaultHortenListState = {
    data: [],
    meta: { status: null, statuscode: null, error: null},
    newItem: { data: null, meta: {error: null, status: null}},
    deletedItem: { data: null, meta: {error: null, status: null}},
    selectedItem: { data: null, meta: {error: null, status: null}},
};


export const createHortenListModel = createHortenModel({
    fetchList: createHaldenAction( "LIST_FETCH"),
    fetchItem: createHaldenAction("ITEM_FETCH"),
    postItem: createHaldenAction("ITEM_POST"),
    postItemFromForm: createHaldenAction( "ITEM_POST_FROM_FORM"),
    updateItem: createHaldenAction( "ITEM_UPDATE"),
    deleteItem: createHaldenAction( "ITEM_DELETE"),
    selectItem: createHaldenAction( "ITEM_SELECT"),
    // TODO: Right now List do not match the logic of the Detail when it comes to subscription aliases alias + "-" + type should be set here
    osloItemUpdate: createHaldenAction( "ITEM_OSLO_UPDATE"),
    osloItemDelete: createHaldenAction( "ITEM_OSLO_DELETE"),
    osloItemCreate: createHaldenAction( "ITEM_OSLO_CREATE"),
    osloJoin: createHaldenAction( "JOIN_ROOM"),
    osloLeave: createHaldenAction( "LEAVE_ROOM"),
})


export const createHortenListApiCreator = (modelurl: HortenModelUrl, _rooturl: any = null, _header: any = null) => createHortenApi({
    fetchList: createHaldenApi((action,state) => {
        let rooturl = _rooturl ? _rooturl : getRootUrl(state)
        let header = _header ? _header : getHeader(state)
        let q = "";
        if (action.payload.filter) {
            q = "?" + qs.stringify(action.payload.filter);
        }
        return ajax
            .getJSON(`${rooturl}/${modelurl}/${q}`, header);
    }),

    fetchItem: createHaldenApi((action,state) => {
        let rooturl = _rooturl ? _rooturl : getRootUrl(state)
        let header = _header ? _header : getHeader(state)
        let q = "";
        if (action.payload.data.id) {
            q = encodeURIComponent(action.payload.data.id);
        }
        else {
            q = encodeURIComponent(action.payload);
        }
        return ajax
            .getJSON(`${rooturl}/${modelurl}/${q}`, header);

    }),

    postItemFromForm: createHaldenApi((action,state) => {
        let rooturl = _rooturl ? _rooturl : getRootUrl(state)
        let header = _header ? _header : getHeader(state)
        const formitem = action.payload;
        return ajax
            .post(`${rooturl}/${modelurl}/`, formitem, header);
    }),

    postItem: createHaldenApi((action,state) => {
        let rooturl = _rooturl ? _rooturl : getRootUrl(state)
        let header = _header ? _header : getHeader(state)
        return ajax
            .post(`${rooturl}/${modelurl}/`, action.payload.data, header);
    }),

    updateItem: createHaldenApi((action,state) => {

        let rooturl = _rooturl ? _rooturl : getRootUrl(state)
        let header = _header ? _header : getHeader(state)
        const q = encodeURIComponent(action.payload.data.id);
        return ajax
            .put(`${rooturl}/${modelurl}/${q}/`, action.payload.data , header);
    }),

    deleteItem: createHaldenApi((action,state) => {

        let rooturl = _rooturl ? _rooturl : getRootUrl(state)
        let header = _header ? _header : getHeader(state)
        const q = encodeURIComponent(action.payload.data.id);
        return ajax.delete(`${rooturl}/${modelurl}/${q}/`, header);
    })

});

export const createHortenListSelectors = (alias: Alias, type: HortenType) => ({
    getData: (state: State, props: Props) => state[alias][type].data,
    getMeta: (state: State, props: Props) => state[alias][type].meta,
    getDeleted: (state: State, props: Props) => state[alias][type].deletedItem,
    getNew: (state: State, props: Props) => state[alias][type].newItem,
    getSelected: (state: State, props: Props) => state[alias][type].selectedItem,
    getModel: (state: State, props: Props) => {return state[alias][type]},
    getProps: (state: State, props: Props) => {return props}
});


export const createHortenListHelper = (alias: Alias, type: HortenType) => null

export const createHortenListEpic = (hortenListModel: HortenListModel, hortenListSelector: HortenListSelectors, hortenListApi: HortenListApi):Epic => {
    return combineEpics(
        createOsloApiEpic(hortenListModel.fetchItem, hortenListApi.fetchItem),
        createOsloApiEpic(hortenListModel.fetchList, hortenListApi.fetchList),
        createOsloApiEpic(hortenListModel.postItem, hortenListApi.postItem),
        createOsloApiEpic(hortenListModel.postItemFromForm, hortenListApi.postItemFromForm),
        createOsloApiEpic(hortenListModel.deleteItem, hortenListApi.deleteItem),
        createOsloApiEpic(hortenListModel.updateItem, hortenListApi.updateItem),
        createOsloPassThroughEpic(hortenListModel.selectItem),
        createOsloJoinRoomEpic(hortenListModel.osloJoin, hortenListModel.alias.toUpperCase() + "-" + hortenListModel.key.toUpperCase())
    )
};

export const createHortenListReducer = (hortenListModel: HortenListModel, defaultState: HortenListDefaultState = defaultHortenListState): Reducer => handleActions(
    {
        // LIST OPTIONS
        [hortenListModel.fetchList.request]: (state, action) => {
            return { ...state, data: [], meta: {error: null, loading: true}};
        },
        [hortenListModel.fetchList.success]: (state, action) => {
            let datalist = []
            action.payload.forEach( item =>  {
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

        // SELECT OPTIONS
        [hortenListModel.selectItem.success]: (state, action) => {
            return {
                ...state, selectedItem: {data: action.payload.data, meta: {error: null, loading: false}}
            }
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

    },
    defaultState
);




export function createHortenList(type: HortenType, modelurl: HortenModelUrl): ((Alias) => HortenList) {
    let modelCreator = createHortenListModel;
    let apiCreator = createHortenListApiCreator(modelurl);
    let selectorsCreator = createHortenListSelectors;
    let helperCreator = createHortenListHelper;
    let epicCreator = createHortenListEpic;
    let reducerCreator = createHortenListReducer;

    return createHorten(type, modelCreator, apiCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator)
}
