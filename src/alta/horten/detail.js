//@flow
import type {Alias, HortenApiCall, HortenModel, HortenSelectors, HortenType} from "./types";
import {ajax} from "rxjs/ajax";
import {Reducer} from "redux";
import handleActions from "redux-actions/es/handleActions";
import {
    deletedFromStavangerList,
    deletingFromStavangerList,
    expandFromOslo,
    getHeader,
    getRootUrl,
    updateStavangerDetail
} from "../helpers";
import {combineEpics, Epic} from "redux-observable";
import {createHorten} from "./index";
import {Observable} from "rxjs";
import {createHortenApi, createHortenHelpers, createHortenModel, createHortenSelectors} from "./creators";
import type {HaldenSelector} from "../halden";
import {createHaldenAction, createHaldenApi, createHaldenSelector} from "../halden";
import type {HaldenActions} from "../oslo";
import {
    combineOsloActionsWithOsloApiCall,
    combineOsloActionsWithPassThrough,
    combineOsloActionWithRoomJoin
} from "../oslo/epics";
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


export type HortenModelUrl = string

// MASHED
export type HortenDetailModel = HortenModel & {
    setItem: HaldenActions,
    fetchItem: HaldenActions,
    postItem: HaldenActions,
    postItemFromForm: HaldenActions,
    updateItem: HaldenActions,
    deleteItem: HaldenActions,
    osloItemUpdate: HaldenActions,
    osloItemCreate: HaldenActions,
    osloItemDelete: HaldenActions,

    osloJoin: HaldenActions,
    osloLeave: HaldenActions,
}

export type HortenDetailApi = {
    fetchList: HortenApiCall,
    fetchItem: HortenApiCall,
    postItem: HortenApiCall,
    deleteItem: HortenApiCall,
    postItemFromForm: HortenApiCall,
    updateItem: HortenApiCall,

}

export type HortenDetailSelectors = HortenSelectors & {
    getData: HaldenSelector,
    getList: HaldenSelector,
    getMeta: HaldenSelector,
    getDeleted: HaldenSelector,
    getNew: HaldenSelector,
    getModel: HaldenSelector,
    getProps: HaldenSelector,

}

export type HortenDetailHelper = {
    [string]: any
}

export type HortenDetailDefaultState = {
    data: null,
    meta: {error: null, status: null},
    postedItem: { data: null, meta: {error: null, status: null}}
}


// Basic List
export type HortenDetail = {
    model: HortenDetailModel,
    selectors: HortenDetailSelectors,
    api: HortenDetailApi,
    helpers: HortenDetailHelper,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenDetailDefaultState
}


export const defaultHortenDetailState = {
    data: null,
    meta: {error: null, status: null},
    postedItem: { data: null, meta: {error: null, status: null}}
};


export const createHortenDetailModel = createHortenModel({
        setItem: createHaldenAction( "ITEM_SET"),
        fetchItem: createHaldenAction("ITEM_FETCH"),
        postItem: createHaldenAction("ITEM_POST"),
        postItemFromForm: createHaldenAction( "ITEM_POST_FROM_FORM"),
        updateItem: createHaldenAction( "ITEM_UPDATE"),
        deleteItem: createHaldenAction( "ITEM_DELETE"),
        // TODO: Right now List do not match the logic of the Detail when it comes to subscription aliases alias + "-" + type should be set here
        osloItemUpdate: createHaldenAction( "UPDATE"),
        osloItemDelete: createHaldenAction( "DELETE"),
        osloItemCreate: createHaldenAction( "CREATE"),
        osloJoin: createHaldenAction( "JOIN_ROOM"),
        osloLeave: createHaldenAction( "LEAVE_ROOM"),
    })


export const createHortenDetailApiCreator = (modelurl: HortenModelUrl, _rooturl: any = null, _header: any = null) => createHortenApi({

    fetchItem: createHaldenApi((action,state): Observable => {
        let rooturl = _rooturl ? _rooturl : getRootUrl(state)
        let header = _header ? _header : getHeader(state)
        let q = "";
        if (action.payload.id) {
            q = encodeURIComponent(action.payload.id);
        }
        else {
            if (action.payload.data) {
                q = encodeURIComponent(action.payload.data.id);
            }
            else q = action.payload
        }
        return ajax
            .getJSON(`${rooturl}/${modelurl}/${q}`, header);

    }),

    postItem: createHaldenApi((action,state) => {
        let rooturl = _rooturl ? _rooturl : getRootUrl(state)
        let header = _header ? _header : getHeader(state)
        return ajax
            .post(`${rooturl}/${modelurl}/`, action.payload.data, header);
    }),

    postItemFromForm: createHaldenApi((action,state) => {
        let rooturl = _rooturl ? _rooturl : getRootUrl(state)
        let header = _header ? _header : getHeader(state)
        const formitem = action.payload;
        return ajax
            .post(`${rooturl}/${modelurl}/`, formitem, header);
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

export const createHortenDetailSelectors = createHortenSelectors({
    getData: createHaldenSelector("data"),
    getMeta: createHaldenSelector("meta"),
    getDeleted: createHaldenSelector("deletedItem"),
    getNew: createHaldenSelector("newItem")
});


export const createHortenDetailHelpers = createHortenHelpers(null)

export const createHortenDetailEpic = (hortenDetailModel: HortenDetailModel, hortenDetailSelectors: HortenDetailSelectors, hortenDetailApi: HortenDetailApi):Epic => {
    let preprocessor = (response) => {return({data: response, meta: {status: "freshlyfetched", model: hortenDetailModel.type.toLowerCase()}})};


    return combineEpics(
        //TODO: Clean up needed here
        combineOsloActionsWithOsloApiCall(hortenDetailModel.fetchItem, hortenDetailApi.fetchItem, preprocessor),
        combineOsloActionsWithOsloApiCall(hortenDetailModel.postItem, hortenDetailApi.postItem,preprocessor),
        combineOsloActionsWithOsloApiCall(hortenDetailModel.postItemFromForm, hortenDetailApi.postItemFromForm,preprocessor),
        combineOsloActionsWithOsloApiCall(hortenDetailModel.deleteItem, hortenDetailApi.deleteItem,preprocessor),
        combineOsloActionsWithOsloApiCall(hortenDetailModel.updateItem, hortenDetailApi.updateItem,preprocessor),
        combineOsloActionWithRoomJoin(hortenDetailModel.osloJoin, hortenDetailModel.alias.toUpperCase() + "-" + hortenDetailModel.key.toUpperCase()),
        combineOsloActionsWithPassThrough(hortenDetailModel.setItem)
    )
};

export const createHortenDetailReducer = (hortenDetailModel: HortenDetailModel, defaultState: HortenDetailDefaultState = defaultHortenDetailState): Reducer => handleActions(
    {
        // LIST OPTIONS
        [hortenDetailModel.fetchItem.request]: (state, action) => {
            return { ...state, meta:{...state.meta, loading: true, status: LOADING}};
        },
        [hortenDetailModel.fetchItem.success]: (state, action) => {
            return { ...state, data: action.payload.data, meta: {...state.meta, loading: false, status: LOADED}};
        },
        [hortenDetailModel.fetchItem.failure]: (state, action) => {
            let error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
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
            let error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
            return {...state, meta: {...state.meta, status: FAILURE}, postedItem: {data:null, meta : {...state.meta, error:error, loading: false, status: FAILURE}}}
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
            let error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
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
            let error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
            return {...state, deletedItem: {item:null, error:error, loading: false}}
        },
        [hortenDetailModel.deleteItem.abort]: (state, action) => {
            return {...state, deletedItem:{item:null, error:null, loading: false}}
        },

        // OSLO SYNC OPTIONS
        [hortenDetailModel.osloItemDelete.success]: (state, action) => {
            //
            let newlist = deletedFromStavangerList(state.data, expandFromOslo(action.payload));
            return {
                ...state, data: newlist, meta: {...state.meta, error: null, loading: false, status: ITEMDELETED(action.payload)},
                deletedItem: expandFromOslo(action.payload)
            }
        }
        ,
        [hortenDetailModel.osloItemCreate.success]: (state, action) => {

            let item = updateStavangerDetail(state.data,action.payload);
            return {
                ...state, data: item, meta: {...state.meta, status: ITEMCREATED(action.payload)}
            }
        },
        [hortenDetailModel.osloItemUpdate.success]: (state, action) => {
            let item = updateStavangerDetail(state.data,action.payload);
            return {
                ...state, data: item , meta: {...state.meta, status: ITEMUPDATED(action.payload)}
            }
        },

    },
    defaultState
);




export function createHortenDetail(type: HortenType, modelurl: HortenModelUrl): ((Alias, key) => HortenDetail) {
    let modelCreator = createHortenDetailModel;
    let apiCreator = createHortenDetailApiCreator(modelurl);
    let selectorsCreator = createHortenDetailSelectors;
    let helperCreator = createHortenDetailHelpers;
    let epicCreator = createHortenDetailEpic;
    let reducerCreator = createHortenDetailReducer;

    return createHorten(type, modelCreator, apiCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator)
}
