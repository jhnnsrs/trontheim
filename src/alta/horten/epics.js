//@flow
import type {Alias,Horten, HortenApi, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten} from "./index";
import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap, takeUntil, map} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";
import {createHortenApi, createHortenHelpers, createHortenModel, createHortenSelectors} from "./creators";
import {
    createHaldenAction,
    createHaldenFunctionSelector,
    createHaldenOsloActions,
    createHaldenSelector
} from "../halden";
import type {HaldenSelector} from "../halden";
import type {StavangerNodesModel} from "../../bergen/models";
import {handleActions} from "redux-actions";
import {Reducer} from "redux";
import type {HaldenActions} from "../oslo";

export type HortenEpicsModel = HortenModel &{
    registerEpic: HaldenActions,
    killEpic: HaldenActions,
}

export type HortenEpicsSelectors = HortenSelectors & {
    getEpics: HaldenSelector
}

export type HortenEpicsApi = HortenApi
export type HortenEpicsHelpers = HortenHelpers

export type HortenEpics = {
    model: HortenEpicsModel,
    selectors: HortenEpicsSelectors,
    api: HortenEpicsApi,
    helpers: HortenEpicsHelpers,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenEpicsDefaultState
}
export const createHortenEpicsModel = createHortenModel({
    registerEpic: createHaldenAction("REGISTER_EPIC"),
    killEpic: createHaldenAction("KILL_EPIC"),
})

export const createHortenEpicsHelpers = createHortenHelpers()

export const createHordenEpicsSelectors = createHortenSelectors({
    getEpics: createHaldenSelector("running"),
})


export const createHortenEpicsApi = createHortenApi({
    fetchItem: () => null
})


export const createHortenEpicsEpic = (model: HortenEpicsModel, selectors: HortenEpicsSelectors, api: HortenEpicsApi ) => {

    // PARTSTART: EPICS
    // The Nodes Epic will carry along the EPICS of all the spawned Node
    const dummyEpic = (action$, ...rest) =>
        action$.pipe(
            ofType("DUMMY"),
            mergeMap(action => {
                // TODO: mabye by buffer? First make sure old graph is destroyed
                return [{type: "NANANANA", payload: "I should never be called"}]
            }));


    const rootNodeEpics = combineEpics(dummyEpic)

    let nodeepic$ = new BehaviorSubject({epic: rootNodeEpics, end: createHaldenOsloActions("I","WILL","DIE"), alias:"DUMMY"});

    const onNodeEpicsChangedLoadEpicsEpic = (action$, ...rest) =>
        nodeepic$.pipe(
            // Since we're using mergeMap, by default any new
            // epic that comes in will be merged into the previous
            // one, unless an EPIC_END action is dispatched first,
            // which would cause the old one(s) to be unsubscribed
            mergeMap(epicdict => {
                    let {epic, end, alias } = epicdict

                    return epic(action$, ...rest).pipe(
                        takeUntil(action$.pipe(
                            ofType(end.request.toString()),
                            map(end => {console.log("Ending Epic for '"+alias + "' gracefully"); return end})
                        ))
                    )
                }
            )
        );


    const registerEpic = (action$, state$) =>
        action$.pipe(
            ofType(model.registerEpic.request.toString()),
            mergeMap(action => {
                // TODO: mabye by buffer? First make sure old graph is destroyed
                let {epic, end, alias} = action.payload
                try {
                    nodeepic$.next({epic: epic, end: end, alias: alias})
                }
                catch (e) {
                    console.log("Failure Registering Epic of '", alias, "' with", model.alias)

                }
                return [model.registerEpic.success(action.payload)]

            }));

    const killEpic = (action$, state$) =>
        action$.pipe(
            ofType(model.killEpic.request.toString()),
            mergeMap(action => {
                return [action.payload.end.request(),
                        model.killEpic.success(action.payload.alias)]

            }));







    return combineEpics(
        onNodeEpicsChangedLoadEpicsEpic,
        registerEpic,
        killEpic
    )
};

export type HortenEpicsDefaultState = {
    running: any,
    touched: any,
}
const initialEpicsState = {
    running: {},
    touched: false
};

export const createHortenEpicsReducer =  (model: HortenEpicsModel, defaultState: HortenEpicsDefaultState = initialEpicsState): Reducer => handleActions(
    {
        [model.killEpic.success.toString()]: (state, action) => {
            let newstate = {...state, touched: true}
            //TODO: Remove Killed Epic from list
            delete newstate.running[action.payload];
            return newstate

        },
        [model.registerEpic.success.toString()]: (state, action) => {
            let newdict = {}
            newdict[action.payload.alias] = action.payload.end.request.toString()
            return {...state, touched: true, running: Object.assign(state.running,newdict)}
        },
    },
    defaultState
);


export function createHortenEpics(type: HortenType): ((Alias) => HortenEpics) {
    let modelCreator = createHortenEpicsModel;
    let apiCreator = createHortenEpicsApi;
    let selectorsCreator = createHordenEpicsSelectors;
    let helperCreator = createHortenEpicsHelpers;
    let epicCreator = createHortenEpicsEpic;
    let reducerCreator = createHortenEpicsReducer;

    return createHorten(type, modelCreator, apiCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator)
}