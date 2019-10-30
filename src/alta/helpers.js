import {CREATED, DELETING, SELECTED, SELECTING, UPDATED} from "./constants";
import {rootURLSelector} from "../authentification/utils";
import type {OsloHeader} from "./oslo";
import {Epic, ofType} from "redux-observable";
import {catchError, map, mergeMap} from "rxjs/operators";
import {Observable} from "rxjs";
import {createAction} from "redux-actions";

export const updateStavangerDetail = (olditem, newitem) => {
    return olditem.id === newitem.id ? newitem : olditem
}
export const expandFromOslo = (payload) => ({
    data: payload,
    meta: {status: null, error: null, loading: false}
})

export function objToString (obj) {
    let str = '';
    for (let key of Object.keys(obj)) {
        let value = obj[key];
        str += key.toString() + '_' + value + "_";
    }
    return str.slice(0, -1);
}

export const deletingFromStavangerList = (array, item) => {
    let objindex = array.findIndex(obj => obj.data.id === item.data.id);
    return [
        ...array.slice(0, objindex),
        {data: item.data, meta: {status: DELETING, error: null, loading: false}},
        ...array.slice(objindex + 1)
    ]
};

export const selectingFromStavangerList = (array, item) => {
    let objindex = array.findIndex(obj => obj.data.id === item.data.id);
    let obj = array.find(obj => obj.data.id === item.data.id);

    return [
        ...array.slice(0, objindex),
        {data: obj.data, meta: {status: SELECTING, error: null, loading: false}},
        ...array.slice(objindex + 1)
    ]
};
export const selectedFromStavangerList = (array, item) => {
    let objindex = array.findIndex(obj => obj.data.id === item.data.id);
    let obj = array.find(obj => obj.data.id === item.data.id);

    return [
        ...array.slice(0, objindex),
        {data: obj.data, meta: {status: SELECTED, error: null, loading: false}},
        ...array.slice(objindex + 1)
    ]
};
export const deletedFromStavangerList = (array, item) => {
    let objindex = array.findIndex(obj => obj.data.id === item.data.id);
    return [
        ...array.slice(0, objindex),
        ...array.slice(objindex + 1)
    ];
};
export const updateStavangerList = (array, item) => {
    let objindex = array.findIndex(obj => obj.data.id === item.data.id);
    if (objindex === -1) {
        return array.concat([{data: item.data, meta: {status: UPDATED, error: null, loading: false}}])
    } else {
        return [
            ...array.slice(0, objindex),
            {data: item.data, meta: {status: UPDATED, error: null, loading: false}},
            ...array.slice(objindex + 1)
        ]
    }
    ;
};
export const pushToStavangerList = (array, item) => {
    let objindex = array.findIndex(obj => obj.data.id === item.data.id);
    if (objindex === -1) {
        return array.concat([{data: item.data, meta: {status: CREATED, error: null, loading: false}}])
    } else {
        return [
            ...array.slice(0, objindex),
            {data: item.data, meta: {status: CREATED, error: null, loading: false}},
            ...array.slice(objindex + 1)
        ]
    }
    ;
};
export const getHeader = (state: any): OsloHeader => ({
    'Content-Type': 'application/json',
    'Authorization': "Bearer " + state.auth.token
});
export const getFormHeader = (state: any): OsloHeader => ({"Authorization": "Bearer " + state.auth.token});

export const getRootUrl = (state: any): string => {
    return rootURLSelector(state) || "FAILURE "
};

export const createOsloApiEpic = (osloactions, apicall, preprocess: any = (item) => {
    return item
}): Epic => {
    return (action$, state$) =>
        action$.pipe(
            ofType(osloactions.request.toString()),
            mergeMap(action => {
                return apicall(action, state$.value)
                    .pipe(
                        map(response => preprocess(response)),
                        map(response => osloactions.success(response)),
                        catchError(error => Observable.of(osloactions.failure(error)))
                    );
            })
        );
};
export const createOsloPassThroughEpic = (osloactions: OsloActions): Epic => {
    return (action$: Observable, state$: Observable) =>
        action$.pipe(
            ofType(osloactions.request.toString()),
            map(action => osloactions.success(action.payload)),
            catchError(error => Observable.of(osloactions.failure(error)))
        );
};

export const joinOsloRoom = createAction("OSLO_JOIN_ROOM_REQUEST");
export const createOsloJoinRoomEpic = (oslo_actions: OsloActions, alias: string) => {
    return (action$: Observable, state$: Observable) =>
        action$.pipe(
            ofType(oslo_actions.request.toString()),
            map(action => {
                let room = objToString(action.payload.filter);

                return joinOsloRoom({room: room, alias: alias})
            }),
            catchError(error => Observable.of(oslo_actions.failure(error)))
        );
};