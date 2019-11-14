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
import type {OsloActions} from "../oslo";


export type HortenUserModel = HortenModel &{
    getUserForToken: OsloActions,
    setUser: OsloActions,
    unsetUser: OsloActions,
}

export type HortenUserSelectors = HortenSelectors & {
    getUser: HaldenSelector,
    hasUser: HaldenSelector,
    getID: HaldenSelector,
}

export type HortenUserHelpers = HortenHelpers

export type HortenUserDefaultState = {
    [string] : any
}

export type HortenUserDefinition = {
    type: HortenType,
    url: string

}


export type HortenUser = {
    model: HortenUserModel,
    selectors: HortenUserSelectors,
    helpers: HortenUserHelpers,
    definition: HortenUserDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenUserDefaultState
}


export const createHortenUserModel = createHortenModel({
    getUserForToken: createHaldenAction("GET_USER_FOR_TOKEN"), // THIS STAYS UNSET FOR ORCHESTRATOR
    setUser: createHaldenAction("SET_USER"),
    unsetUser: createHaldenAction("UNSET_USER"),
})

export const createHortenUserHelpers = createHortenHelpers()

export const createHordenUserSelectors = createHortenSelectors({
    getUser: createHaldenSelector("currentUser"),
    getID: createHaldenSelector("id"),
    hasUser: createHaldenSelector("hasUser"),
})



export const createHortenUserEpic = createHortenEpic((model: HortenUserModel, selectors: HortenUserSelectors) => ({

    setUserEpic: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.setUser.request),
            mergeMap(action => {
                return [model.setUser.success(action)]
            })
        )
    ),
    unsetUserPassThrough: createHaldenPassThroughEpicFromActions(model.unsetUser)

}))

const defaultState = {
    currentUser: null,
    hasUser: false,
    id: null,
};

export const createHortenUserReducer = createHortenReducer( (model: HortenUserModel) => (
    {
        [model.setUser.success.toString()]: (state, action) => {
            return {...state, currentUser: action.payload.data, hasUser: true, id: action.payload.data.id}

        },
        [model.unsetUser.success]: (state, action) => {
            return { ...state, currentUser: null, hasUser: false, id: null}
        }
    })
);

export function createHortenUser(definition: HortenUserDefinition): ((Alias) => HortenUser) {
    let modelCreator = createHortenUserModel;
    let selectorsCreator = createHordenUserSelectors;
    let helperCreator = createHortenUserHelpers;
    let epicCreator = createHortenUserEpic;
    let reducerCreator = createHortenUserReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}