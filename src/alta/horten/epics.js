//@flow
import type {Alias, HortenApi, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten, createHorten2} from "./index";
import {combineEpics, Epic, ofType} from "redux-observable";
import {catchError, map, mergeMap, takeUntil} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";
import {
    createHortenApi,
    createHortenEpic,
    createHortenHelpers,
    createHortenModel, createHortenReducer,
    createHortenSelectors
} from "./creators";
import type {HaldenSelector} from "../halden";
import {createHaldenAction, createHaldenOsloActions, createHaldenSelector} from "../halden";
import {handleActions} from "redux-actions";
import {Reducer} from "redux";
import type {HaldenActions} from "../oslo";
import type {HortenEdgeDefinition} from "./edge";

export type HortenEpicsModel = HortenModel &{
    registerEpic: HaldenActions,
    killEpic: HaldenActions,
}

export type HortenEpicsSelectors = HortenSelectors & {
    getEpics: HaldenSelector
}

export type HortenEpicsHelpers = HortenHelpers

export type HortenEpicsDefinition = {
    type: HortenType
}

export type HortenEpics = {
    model: HortenEpicsModel,
    selectors: HortenEpicsSelectors,
    definition: HortenEdgeDefinition,
    helpers: HortenEpicsHelpers,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenEpicsDefaultState
}
export const createHortenEpicsModel = createHortenModel({
    registerEpic: createHaldenAction("REGISTER_EPIC",true),
    killEpic: createHaldenAction("KILL_EPIC", true),
})

export const createHortenEpicsHelpers = createHortenHelpers()

export const createHordenEpicsSelectors = createHortenSelectors({
    getEpics: createHaldenSelector("running"),
})




export const createHortenEpicsEpic = createHortenEpic(( model: HortenEpicsModel, selectors: HortenEpicsSelectors, helpers: HortenEpicsHelpers ) => {

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

    let nodeepic$ = new BehaviorSubject({
        epic: rootNodeEpics,
        end: createHaldenOsloActions("I", "WILL", "DIE"),
        alias: "DUMMY"
    });

    const onNodeEpicsChangedLoadEpicsEpic = (action$, ...rest) =>
        nodeepic$.pipe(
            // Since we're using mergeMap, by default any new
            // epic that comes in will be merged into the previous
            // one, unless an EPIC_END action is dispatched first,
            // which would cause the old one(s) to be unsubscribed
            mergeMap(epicdict => {
                    let {epic, end, alias} = epicdict
                    return epic(action$, ...rest).pipe(
                        takeUntil(action$.pipe(
                            ofType(end.request),
                            map(end => {
                                helpers.log("===== Ending Epic for '" + alias + "' gracefully =====");
                                return end
                            })
                        )),
                        catchError((error, source) => {
                            console.error("Error in orchestrator in " + alias + " | " + '\n', error);
                            return source;
                        })
                    )
                }
            )
        );

    const onRegisterEpicSuccess = (action$, state$) =>
        action$.pipe(
            ofType(model.registerEpic.success),
            mergeMap(action => {
                // TODO: mabye by buffer? First make sure old graph is destroyed
                let {epic, end, alias, pageInit} = action.meta
                helpers.log("Epic for "  + alias + " successfully registered ")
                return [pageInit]

            }));


    const registerEpic = (action$, state$) =>
        action$.pipe(
            ofType(model.registerEpic.request),
            mergeMap(action => {
                // TODO: mabye by buffer? First make sure old graph is destroyed
                let {epic, end, alias, pageInit} = action.meta

                helpers.log("Registering Epic for " + alias)
                try {
                    nodeepic$.next({epic: epic, end: end, alias: alias})
                } catch (e) {
                    helpers.log("Failure Registering Epic of '", alias, "' with", model.alias)

                }
                return [model.registerEpic.success(action.payload, action.meta)]

            }));


    const killEpicRequest = (action$, state$) =>
        action$.pipe(
            ofType(model.killEpic.request.toString()),
            mergeMap(action => {
                const {end, killPage, alias} = action.payload

                return [killPage, model.killEpic.success({alias: alias, end: end}),]


            }));


    const killEpic = (action$, state$) =>
        action$.pipe(
            ofType(model.killEpic.success.toString()),
            mergeMap(action => {
                const {end} = action.payload

                return [end.request()]

            }));


    return {
        onNodeEpicsChangedLoadEpicsEpic,
        registerEpic,
        onRegisterEpicSuccess,
        killEpicRequest,
        killEpic
    }
}
);

export type HortenEpicsDefaultState = {
    running: any,
    touched: any,
}
const initialEpicsState = {
    running: {},
    touched: false
};

export const createHortenEpicsReducer =  createHortenReducer((model: HortenEpicsModel): Reducer => (
    {
        [model.killEpic.success]: (state, action) => {
            let newstate = {...state, touched: true}
            //TODO: Remove Killed Epic from list
            delete newstate.running[action.meta.alias];
            return newstate

        },
        [model.registerEpic.success]: (state, action) => {
            let newdict = {}
            newdict[action.meta.alias] = action.meta.end.request.toString()
            return {...state, touched: true, running: Object.assign(state.running,newdict)}
        },
    }
));


export function createHortenEpics(definition: HortenEpicsDefinition): ((Alias) => HortenEpics) {
    let modelCreator = createHortenEpicsModel;
    let selectorsCreator = createHordenEpicsSelectors;
    let helperCreator = createHortenEpicsHelpers;
    let epicCreator = createHortenEpicsEpic;
    let reducerCreator = createHortenEpicsReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, initialEpicsState)
}