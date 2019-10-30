import {Epic, ofType} from "redux-observable";
import {catchError, map, mergeMap} from "rxjs/operators";
import {Observable} from "rxjs";
import type {HaldenActions, OsloApiCall} from "./index";
import {joinOsloRoom} from "./actions";
import {objToString} from "./utils";


export const combineOsloActionsWithOsloApiCall = (haldenActions: HaldenActions, apicall: OsloApiCall, preprocess: any = (item) => {return item}): Epic => {
    return (action$, state$) =>
        action$.pipe(
            ofType(haldenActions.request.toString()),
            mergeMap(action => {
                return apicall(action,state$.value)
                    .pipe(
                        map(response => preprocess(response)),
                        map(response => haldenActions.success(response)),
                        catchError(error => Observable.of(haldenActions.failure(error)))
                    );
            })
        );
};

export const combineOsloActionsWithPassThrough = (haldenActions: HaldenActions): Epic => {
    return (action$: Observable, state$: Observable) =>
        action$.pipe(
            ofType(haldenActions.request.toString()),
            map(action => haldenActions.success(action.payload)),
            catchError(error => Observable.of(haldenActions.failure(error)))
        );
};

export const combineOsloActionWithRoomJoin = (haldenActions: HaldenActions, alias: string) => {
    return (action$: Observable, state$: Observable) =>
        action$.pipe(
            ofType(haldenActions.request.toString()),
            map(action => {
                let room = objToString(action.payload.filter);

                return joinOsloRoom({room: room, alias: alias.toUpperCase()})
            }),
            catchError(error => Observable.of(haldenActions.failure(error)))
        );
};