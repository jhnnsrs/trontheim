import type {Alias, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten2} from "./index";
import {Epic, ofType} from "redux-observable";
import {map, mergeMap, takeUntil} from "rxjs/operators";
import {
    createHortenEpic,
    createHortenHelpers,
    createHortenModel,
    createHortenReducer,
    createHortenSelectors
} from "./creators";
import type {HaldenParameterAction, HaldenSelector} from "../halden";
import {createHaldenAction, createHaldenEpic, createHaldenParamterizedAction, createHaldenSelector} from "../halden";
import {Reducer} from "redux";
import type {HaldenActions} from "../oslo";
import {Observable} from "rxjs";
import BroadcastChannel from 'broadcast-channel'

import v4 from 'uuid'

export type HortenCurtainModel = HortenModel & {
    openChannel: HaldenActions,
    openExternal: HaldenActions,
    openAlien: HaldenActions,

    // Outs
    pushExternal: HaldenActions,
    listenToExternal: HaldenActions,


    // In
    // Local
    sendToExternal: HaldenActions,

    // From
    messageFromExternal: HaldenActions,

    listenToAlien: HaldenActions,
    stopListenToAlien: HaldenActions,
    sendToAlien: HaldenActions,
    channelMessage: HaldenParameterAction,
    alienMessage: HaldenParameterAction,
    messageSent: HaldenParameterAction,
    closeChannel: HaldenParameterAction,
    closeAlien: HaldenActions,
    sendMessage: HaldenActions,
    receiveFromAlien: HaldenActions,

}

export type HortenCurtainSelectors = HortenSelectors & {
    getCurrentAuth: HaldenSelector,
    getJoinedRooms: HaldenSelector
}

export type HortenCurtainHelpers = HortenHelpers

export type HortenVeilDefaultState = {
    [string]: any
}

export type HortenVeilDefinition = {
    type: HortenType,
    alienApi: string,
    statusApi: string,

}


export type HortenCurtain = {
    model: HortenCurtainModel,
    selectors: HortenCurtainSelectors,
    helpers: HortenCurtainHelpers,
    definition: HortenVeilDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenVeilDefaultState
}


export const createHortenCurtainModel = createHortenModel({
    openChannel: createHaldenAction("OPEN_CHANNEL"),
    openExternal: createHaldenAction("OPEN_EXTERNAL"),
    pushExternal: createHaldenAction("PUSH_EXTERNAL"),
    openAlien: createHaldenAction("OPEN_ALIEN"),
    closeAlien: createHaldenAction("CLOSE_ALIEN"),
    sendToAlien: createHaldenAction("SEND_TO_ALIEN"),
    sendToExternal: createHaldenAction("SEND_TO_EXTERNAL"),
    listenToAlien: createHaldenAction("LISTEN_TO_ALIEN"),
    stopListenToAlien: createHaldenAction("STOP_LISTEN_TO_ALIEN"),
    messageFromExternal: createHaldenAction("MESSAGE_FROM_EXTERNAL"),
    channelMessage: createHaldenParamterizedAction(params => "RECEIVE_MESSAGE_ON_CHANNEL_" + params),
    alienMessage: createHaldenParamterizedAction(params => "RECEIVE_MESSAGE_ON_ALIEN_" + params),
    sendMessage: createHaldenAction("SEND_MESSAGE_TO_CHANNEL"),
    messageSent: createHaldenParamterizedAction(params => "MESSAGE_SENT_TO_CHANNEL_" + params),
    closeChannel: createHaldenParamterizedAction(params => "CLOSE_CHANNEL_" + params),
    receiveFromAlien: createHaldenAction("RECEIVE_FROM_ALIEN")
})

export const createHortenCurtainHelpers = createHortenHelpers()

export const createHordenCurtainSelectors = createHortenSelectors({
    getOpenChannels: createHaldenSelector("OPEN_CHANNELS"),
})

export const THIS_WINDOW_ID = v4()

export const createHortenCurtainEpic = createHortenEpic((model: HortenCurtainModel, selectors: HortenCurtainSelectors, helpers: HortenCurtainHelpers) => ({

    onPushedExternalSet: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.pushExternal.success),
            mergeMap(action => {
                    // TODO: Should check if server has been chosen
                    // SUBSCRIBE TO SOCKET IF AUTHENTICATED

                    let external = action.payload.data // WITH ID BECAUSE IT WAS POSTED
                    helpers.log("Checkign if external was created by this Window ", action.payload)

                    if (external.origin === THIS_WINDOW_ID) {
                        return [
                            model.openExternal.success(external),
                        ]
                    }
                    else {
                        helpers.log("Simultanous opening of two Flows should be avoided")
                        return [{type: "DIFFERENT WINDOW ID", payload: "Simultanious opening of two Flows should be avoided"}
                        ]

                    }
                    }
            )
        )
    ),
    openExternal: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.openExternal.request),
            mergeMap(action => {
                    // TODO: Should check if server has been chosen
                    // SUBSCRIBE TO SOCKET IF AUTHENTICATED
                    helpers.log("Trying to open External for node" ,action.payload)

                    let instance = action.payload.instance
                    let path = action.payload.path
                    let defaultsettings = action.payload.defaultsettings
                    let creator = action.payload.creator

                    let external = {
                        data: {
                            name: instance, // TODO: Beautify this
                            node: path,
                            defaultsettings: JSON.stringify(defaultsettings),
                            status: "alive",
                            creator: creator,
                            ports: JSON.stringify(action.payload.ports),
                            links: "notset", // TODO: Replace on Backend,
                            origin: THIS_WINDOW_ID
                        },
                        meta: {
                        }
                    }

                    return [model.pushExternal.request(external)]
                }
            )
        )
    ),
    messageReceivedFromExternal: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.messageFromExternal.request),
            mergeMap(action => {
                    // TODO: Should check if server has been chosen
                    // SUBSCRIBE TO SOCKET IF AUTHENTICATED
                    helpers.log(action.payload)
                    let message = action.payload.data
                    let origin = message.origin



                    if (origin != THIS_WINDOW_ID) {

                        let external = message.external
                        let instance = message.instance


                        helpers.log("Message from External Representation of Instance " + instance + " at External" + external)
                        return [model.messageFromExternal.success(action.payload)]
                    } else {
                        helpers.log("PING PONG RECEIVED")
                        return [{type: "SELF_SEND_PING_PONG"}]
                    }

                }
            )
        )
    ),
    sendToExternal: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.sendToExternal.request),
            mergeMap(action => {
                    helpers.log(action.payload)

                    // Make a request to the external Source
                    const data = action.payload.data
                    const meta = action.payload.meta

                    const  externalrequest = {
                        data: {
                            data: JSON.stringify(data),
                            port: meta.port,
                            instance: meta.instance, // IS the targeted instance
                            model: meta.type,
                            origin: THIS_WINDOW_ID,
                            external: meta.external,
                            creator: data.creator,
                            kind: meta.kind
                        },
                        meta: {}
                    }

                    return [model.sendMessage.request(externalrequest)]

                }
            ))
    )
}))


const defaultState = {
    externals: {},
    joinedRooms: {}
};

export const createHortenCurtainReducer = createHortenReducer((model: HortenCurtainModel) => (
    {
        [model.openExternal.success.toString()]: (state, action) => {
            return {...state, externals: {...state.externals, [action.payload.instance]: "ACTIVE"}}

        },
    })
);

export function createHortenCurtain(definition: HortenVeilDefinition): ((Alias) => HortenCurtain) {
    let modelCreator = createHortenCurtainModel;
    let selectorsCreator = createHordenCurtainSelectors;
    let helperCreator = createHortenCurtainHelpers;
    let epicCreator = createHortenCurtainEpic;
    let reducerCreator = createHortenCurtainReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}