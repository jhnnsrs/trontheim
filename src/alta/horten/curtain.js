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
    openAlien: HaldenActions,
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
    openAlien: createHaldenAction("OPEN_ALIEN"),
    closeAlien: createHaldenAction("CLOSE_ALIEN"),
    sendToAlien: createHaldenAction("SEND_TO_ALIEN"),
    listenToAlien: createHaldenAction("LISTEN_TO_ALIEN"),
    stopListenToAlien: createHaldenAction("STOP_LISTEN_TO_ALIEN"),
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


let runningChannels = {}


function getChannelOrCreate(channel, options): BroadcastChannel {
    if (channel in runningChannels) return runningChannels[channel]
    else {
        runningChannels[channel] = new BroadcastChannel(channel, options)
        return runningChannels[channel]
    }

}


function fromChannel(channel, options) {
    return new Observable((observer) => {
        const handler = (e) => {
            console.log("received in obersble");
            observer.next(e)
        };
        const errorHandler = (e) => observer.error(e)

        let channels = new getChannelOrCreate(channel, options)
        // Add the event handler to the target
        channels.onmessage = handler

        return () => {
            // Detach the event handler from the target
            console.log("CLOSING CHANNEL")
        };
    });
}

export interface ChannelMessage {
    origin: string,
    payload: T
}

export const THIS_WINDOW_ID = v4()

export const createHortenCurtainEpic = createHortenEpic((model: HortenCurtainModel, selectors: HortenCurtainSelectors) => ({

    openChannelEpic: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.openChannel.request),
            mergeMap(action => {
                    // TODO: Should check if server has been chosen
                    // SUBSCRIBE TO SOCKET IF AUTHENTICATED
                    let channel = action.payload.toString()

                    console.log("DOIGN THE OPENING on channel", channel)
                    const messages = fromChannel(channel);
                    console.log(runningChannels)
                    return messages.pipe(
                        map((message: ChannelMessage) => {
                            let received = JSON.parse(message)
                            if (received.origin != THIS_WINDOW_ID) {
                                return model.channelMessage(channel).request(received.payload)
                            } else {
                                return {type: "SELF_SEND_PING_PONG"}
                            }

                        }),
                        takeUntil(action$.pipe(
                            ofType(model.closeChannel(channel).request)
                        ))
                    )


                }
            )
        )
    ),
    openAlienEpic: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.openAlien.request),
            mergeMap(action => {
                    // TODO: Should check if server has been chosen
                    // SUBSCRIBE TO SOCKET IF AUTHENTICATED
                    let alien = action.payload.toString()

                    let request = {
                        meta: {
                            room:
                                {
                                    nodeid: alien
                                }
                        }
                    }
                    return [model.listenToAlien.request(request)]
                }
            )
        )
    ),
    closeAlienEpic: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.closeAlien.request),
            mergeMap(action => {
                    // TODO: Should check if server has been chosen
                    // SUBSCRIBE TO SOCKET IF AUTHENTICATED
                    let alien = action.payload.toString()

                    let request = {
                        meta: {
                            room:
                                {
                                    nodeid: alien
                                }
                        }
                    }
                    return [model.stopListenToAlien.request(request)]
                }
            )
        )
    ),
    messageReceivedFromAlienEpic: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.receiveFromAlien.request),
            mergeMap(action => {
                    // TODO: Should check if server has been chosen
                    // SUBSCRIBE TO SOCKET IF AUTHENTICATED
                    console.log(action.payload)
                    let message = action.payload.data
                    let itmodel = JSON.parse(message.data)
                    let origin = message.origin
                    let nodeid = message.nodeid


                    if (origin != THIS_WINDOW_ID) {
                        return [model.alienMessage(nodeid).request(itmodel)]
                    } else {
                        return [{type: "SELF_SEND_PING_PONG"}]
                    }

                }
            )
        )
    ),
    sendMessageEpic: createHaldenEpic((action$, state$) =>
        action$.pipe(
            // The Room ought to be the payload of the string
            // action.payload = {room: $ROOM, ALIAS: $ALIAS}
            ofType(model.sendMessage.request),
            mergeMap(action => {
                    // Constructing the Necessary Room Parameters
                    let channel = action.payload.meta.channel
                    let alien = action.payload.meta.alien

                    if (channel) {
                        console.log("SENDING MESSAGE on channel", channel)

                        let message = {
                            origin: THIS_WINDOW_ID,
                            payload: action.payload
                        }

                        let broadcast = getChannelOrCreate(channel)
                        broadcast.postMessage(JSON.stringify(message))
                        console.log(runningChannels)
                        return [model.messageSent(channel).request(message)]
                    }
                    if (alien) {
                        console.log("SENDING MESSAGE TO FOREIGN", alien)

                        let request = {
                            data:
                                {
                                    origin: THIS_WINDOW_ID,
                                    nodeid: alien,
                                    data: JSON.stringify(action.payload)

                                },
                            meta:
                                {update: null}
                        }

                        return [model.sendToAlien.request(request)]


                    }

                }
            ))
    )
}))


const defaultState = {
    openChannels: {},
    joinedRooms: {}
};

export const createHortenCurtainReducer = createHortenReducer((model: HortenCurtainModel) => (
    {
        [model.openChannel.success.toString()]: (state, action) => {
            return {...state, channels: {...state.channels, [action.payload.meta.channel]: "ACTIVE"}}

        },
    })
);

export function createHortenCurtain(definition: HortenVeilDefinition): ((Alias) => HortenVeil) {
    let modelCreator = createHortenCurtainModel;
    let selectorsCreator = createHordenCurtainSelectors;
    let helperCreator = createHortenCurtainHelpers;
    let epicCreator = createHortenCurtainEpic;
    let reducerCreator = createHortenCurtainReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}