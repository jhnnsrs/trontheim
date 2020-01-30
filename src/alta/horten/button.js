//@flow
import type {Alias, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten2} from "./index";
import {Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
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
import type {HaldenActions} from "../oslo";

export type HortenButtonModel = HortenModel & {
    ApiRequest: HaldenActions,
    setAuth: HaldenActions,
    setHeaders: HaldenActions,
    setAvailableAuths: HaldenActions
}

export type HortenButtonSelectors = HortenSelectors & {
    getCurrentAuth: HaldenSelector
}


export type HortenButtonHelpers = HortenHelpers & {}


export type HortenButtonDefaultState = {
    [string]: any
}

export type HortenButtonDefinition = {
    type: HortenType

}

export type HortenButton = {
    model: HortenButtonModel,
    selectors: HortenButtonSelectors,
    helpers: HortenButtonHelpers,
    definition: HortenButtonDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenButtonDefaultState
}


export const createHortenButtonModel = createHortenModel({
    example: createHaldenAction("example"),
})

export const createHortenButtonHelpers = createHortenHelpers()

export const createHortenButtonSelectors = createHortenSelectors({
    example: createHaldenSelector("example"),
})


export const createHortenButtonEpic = createHortenEpic((model: HortenButtonModel, selectors: HortenButtonSelectors) => ({

    exampleEpic: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.ApiRequest.request),
            mergeMap(action => {

                return [model.example.request()]
            })
        )
    ),
    examplePassThrough: createHaldenPassThroughEpicFromActions(model.setAuth),
}));


const defaultState = {};

export const createHortenButtonReducer = createHortenReducer((model: HortenButtonModel) => (
    {
        [model.setAuth.success.toString()]: (state, action) => {
            return {...state, currentAuth: action.payload}

        },
        [model.setAvailableAuths.success.toString()]: (state, action) => {
            return {...state, authList: action.payload}
        },
        [model.setHeaders.success.toString()]: (state, action) => {
            return {...state, currentHeaders: action.payload}

        }
    })
);

export function createHortenButton(definition: HortenButtonDefinition): ((Alias) => HortenButton) {
    let modelCreator = createHortenButtonModel;
    let selectorsCreator = createHortenButtonSelectors;
    let helperCreator = createHortenButtonHelpers;
    let epicCreator = createHortenButtonEpic;
    let reducerCreator = createHortenButtonReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}