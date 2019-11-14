//@flow
import type {Alias, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten2} from "./index";
import {Epic, ofType} from "redux-observable";
import {of} from 'rxjs';
import {catchError, map, mergeMap, takeUntil} from "rxjs/operators";
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
    createHaldenEpic,
    createHaldenPassThroughEpicFromActions,
    createHaldenSelector
} from "../halden";
import {Reducer} from "redux";
import websocketConnect from "rxjs-websockets";
import {QueueingSubject} from "queueing-subject";
import type {HaldenActions} from "../oslo";

export type HortenOsloModel = HortenModel &{
    setAuth: HaldenActions,
    startOsloSync: HaldenActions,
    stopOsloSync: HaldenActions,
    connectionLost: HaldenActions,
    joinRoom: HaldenActions,
    joinRoomServer: HaldenActions,
    leaveRoomServer: HaldenActions,
    leaveRoom: HaldenActions,

}

export type HortenOsloSelectors = HortenSelectors & {
    getCurrentAuth: HaldenSelector,
    getJoinedRooms: HaldenSelector
}

export type HortenOsloHelpers = HortenHelpers

export type HortenOsloDefaultState = {
    [string] : any
}

export type HortenOsloDefinition = {
    type: HortenType

}


export type HortenOslo = {
    model: HortenOsloModel,
    selectors: HortenOsloSelectors,
    helpers: HortenOsloHelpers,
    definition: HortenOsloDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenOsloDefaultState
}


export const createHortenOsloModel = createHortenModel({
    setAuth: createHaldenAction("SET_AUTH"),
    startOsloSync: createHaldenAction("START_OSLO_SYNC"),
    stopOsloSync: createHaldenAction("STOP_OSLO_SYNC"),
    connectionLost: createHaldenAction("CONNECTION_LOST"),
    joinRoom: createHaldenAction("JOIN_ROOM"),
    joinRoomServer: createHaldenAction("JOIN_ROOM_SERVER"),
    leaveRoom: createHaldenAction("LEAVE_ROOM"),
    leaveRoomServer: createHaldenAction("LEAVE_ROOM_SERVER"),
})

export const createHortenOsloHelpers = createHortenHelpers()

export const createHordenOsloSelectors = createHortenSelectors({
    getCurrentAuth: createHaldenSelector("currentAuth"),
    getJoinedRooms: createHaldenSelector("joinedRooms"),
})

// Helpers
const input = new QueueingSubject();

export function objToString (obj) {
    let str = '';
    for (let key of Object.keys(obj)) {
        let value = obj[key];
        str += key.toString() + '_' + value + "_";
    }
    return str.slice(0, -1);
}

export const createHortenOsloEpic = createHortenEpic((model: HortenOsloModel, selectors: HortenOsloSelectors) => ({

    startOsloEpic: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.startOsloSync.request),
            mergeMap(action => {
                    // TODO: Should check if server has been chosen
                    // SUBSCRIBE TO SOCKET IF AUTHENTICATED
                    let token = action.payload.token
                    let socketapi = action.payload.websocket;
                    try {
                        const {messages} = websocketConnect(socketapi + token, input);
                        return messages.pipe(
                            map(payload => {
                                payload = JSON.parse(payload);
                                if (payload.room) {

                                    let alias = payload.alias;

                                    let joinedRoom = selectors.getJoinedRooms(state$.value)[alias]

                                    let method = payload.method;

                                    let data = payload.data
                                    let meta = {status: "FreshfromOslo"}
                                    let sendpayload = {data,meta}

                                    let stream = payload.stream;
                                    if (joinedRoom.stream.toUpperCase() == stream.toUpperCase()) {
                                        if (method == "update") return joinedRoom.updateAction.request(sendpayload)
                                        if (method == "delete") return joinedRoom.deleteAction.request(sendpayload)
                                        if (method == "create") return joinedRoom.createAction.request(sendpayload)
                                    }
                                }
                                if (payload.joined) {
                                    return model.joinRoomServer.success(payload)
                                }
                                if (payload.left) {
                                    return model.leaveRoomServer.success(payload)

                                }
                                else {
                                    return {type: "OSLO_ERROR_IN", payload: payload}
                                }}),
                            takeUntil(action$.pipe(
                                ofType(model.stopOsloSync.request)
                            )),
                            catchError(err => of(model.connectionLost.request(err)))
                        );
                    }
                    catch (e) {
                        return {type: "OSLO_CONNECTION_ERROR", payload: e}
                    }


                }
            )
        )
    ),
    joinRoomEpic: createHaldenEpic((action$, state$) =>
    action$.pipe(
        // The Room ought to be the payload of the string
        // action.payload = {room: $ROOM, ALIAS: $ALIAS}
        ofType(model.joinRoom.request),
        mergeMap(action => {
                // Constructing the Necessary Room Parameters
                try {
                    let room = objToString(action.payload.meta.room)
                    input.next(JSON.stringify({"command":"sub","room":room,"alias":action.payload.meta.alias}));
                    return [model.joinRoom.success(action.payload)]
                }
                catch (e) {
                    console.log("Joining the room for '" +action.payload.meta.alias+ '" failed');
                    return [model.joinRoom.failure("Join Room Failure")]

                }





            }
        ))
    ),
    leaveRoomEpic: createHaldenEpic((action$, state$) =>
    action$.pipe(
        // The Room ought to be the payload of the string
        // action.payload = {room: $ROOM, ALIAS: $ALIAS}
        ofType(model.leaveRoom.request),
        mergeMap(action => {
                let room = objToString(action.payload.meta.room)

                input.next(JSON.stringify({"command":"leave","room":action.payload.meta.room,"alias":action.payload.meta.alias}));
                return [model.leaveRoom.success(action.payload)]
            }
        ))
    ),
    setAuthToChangeConnection: createHaldenEpic( (action$,state$) =>
    action$.pipe(
        ofType(model.setAuth.success),
        mergeMap(action => [model.startOsloSync.request(action.payload)])
    )),
    setAuthPassThrough: createHaldenPassThroughEpicFromActions(model.setAuth)

}))




const defaultState = {
    currentAuth: null,
    joinedRooms: {}
};

export const createHortenOsloReducer = createHortenReducer( (model: HortenOsloModel) => (
    {
        [model.setAuth.success.toString()]: (state, action) => {
            return {...state, currentAuth: action.payload}

        },
        [model.joinRoom.success]: (state, action) => {
            let joinedRooms = state.joinedRooms
            joinedRooms[action.payload.meta.alias] = {
                stream: action.payload.meta.stream,
                room: action.payload.meta.room,
                deleteAction: action.payload.meta.deleteAction,
                updateAction: action.payload.meta.updateAction,
                createAction: action.payload.meta.createAction,
            }
            return { ...state, joinedRooms: joinedRooms}
        }
    })
);

export function createHortenOslo(definition: HortenOsloDefinition): ((Alias) => HortenOslo) {
    let modelCreator = createHortenOsloModel;
    let selectorsCreator = createHordenOsloSelectors;
    let helperCreator = createHortenOsloHelpers;
    let epicCreator = createHortenOsloEpic;
    let reducerCreator = createHortenOsloReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}