//@flow
import type {Alias, Horten, HortenApi, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten, createHorten2} from "./index";
import {combineEpics, Epic, ofType} from "redux-observable";
import {catchError, map, mergeMap, takeUntil} from "rxjs/operators";
import {
    createHortenApi, createHortenEpic,
    createHortenEpics,
    createHortenHelpers,
    createHortenModel, createHortenReducer,
    createHortenSelectors
} from "./creators";
import {
    createHaldenAction,
    createHaldenApi,
    createHaldenEpic,
    createHaldenFunctionSelector, createHaldenPassThroughEpicFromActions,
    createHaldenSelector
} from "../halden";
import type {HaldenSelector} from "../halden";
import type {StavangerNodesModel} from "../../bergen/models";
import {handleActions} from "redux-actions";
import {Reducer} from "redux";
import {ajax} from "rxjs/ajax";
import * as qs from "querystring";
import {Observable} from "rxjs";
import type {HaldenActions} from "../oslo";

export type HortenCubeModel = HortenModel & {
    setZValue: HaldenActions,
    setUpperLimit: HaldenActions,
    setLowerLimit: HaldenActions,
    postVectors: HaldenActions,
    postSlice: HaldenActions,
    setOrientation: HaldenActions,
    setConvention: HaldenActions,
    setAngle: HaldenActions,
}

export type HortenCubeSelectors = HortenSelectors & {
    getUpperLimit: HaldenSelector,
    getLowerLimit: HaldenSelector,
    getZValue: HaldenSelector,
}


export type HortenCubeHelpers = HortenHelpers & {}


export type HortenCubeDefaultState = {
    [string]: any
}

export type HortenCubeDefinition = {
    type: HortenType

}

export type HortenCube = {
    model: HortenCubeModel,
    selectors: HortenCubeSelectors,
    helpers: HortenCubeHelpers,
    definition: HortenCubeDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenCubeDefaultState
}


export const createHortenCubeModel = createHortenModel({
    setZValue: createHaldenAction("SET_Z_VALUE"),
    setUpperLimit: createHaldenAction("SET_UPPER_LIMIT"),
    setLowerLimit: createHaldenAction("SET_LOWER_LIMIT"),
    postVectors: createHaldenAction("POST_VECTORS"),
    postSlice: createHaldenAction("POST_SLICE"),
    setOrientation: createHaldenAction("SET_ORIENTATION"),
    setConvention: createHaldenAction("SET_CONVENTION"),
    setAngle: createHaldenAction("SET_ANGLE")
})

export const createHortenCubeHelpers = createHortenHelpers()

export const createHortenCubeSelectors = createHortenSelectors({
    getZValue: createHaldenSelector("zValue"),
    getUpperLimit: createHaldenSelector("upperBound"),
    getLowerLimit: createHaldenSelector("lowerBound"),
})


export const createHortenCubeEpic = createHortenEpic((model: HortenCubeModel, selectors: HortenCubeSelectors) => ({

    setLowerPassThrough: createHaldenPassThroughEpicFromActions(model.setLowerLimit),
    setUpperPassThrough: createHaldenPassThroughEpicFromActions(model.setUpperLimit),
    setOrientationPassThrough: createHaldenPassThroughEpicFromActions(model.setOrientation),
    setConventionPassThrough: createHaldenPassThroughEpicFromActions(model.setConvention),
    setAnglePassThrough: createHaldenPassThroughEpicFromActions(model.setAngle),
    setZPassThrough: createHaldenPassThroughEpicFromActions(model.setZValue),
    postSliceEpic: createHaldenEpic( (actions$, state$) =>
    actions$.pipe(
        ofType(model.postSlice.request),
        mergeMap( action => {
             let upper = selectors.getUpperLimit(state$.value)
             let lower = selectors.getLowerLimit(state$.value)

            let slice = { upper, lower}
            return [ model.postSlice.success({data: slice, meta: null})]

        })
    ))
}));


const defaultState = {
    zValue: null,
    upperBound: null,
    lowerBound: null,
    orientation: null,
    convention: "neuro",
    angle: 90
};

export const createHortenCubeReducer = createHortenReducer((model: HortenCubeModel) => (
    {
        [model.setZValue.success.toString()]: (state, action) => {
            return { ...state, zValue: action.payload };
        },
        [model.setUpperLimit.success.toString()]: (state, action) => {
            return { ...state, upperBound: state.zValue };
        },
        [model.setLowerLimit.success.toString()]: (state, action) => {
            return { ...state, lowerBound: state.zValue };
        },
        [model.setOrientation.success]: (state, action) => {
            return { ...state, orientation: action.payload };
        },
        [model.setConvention.success]: (state, action) => {
            return { ...state, convention: action.payload };
        },
        [model.setAngle.success]: (state, action) => {
            return { ...state, angle: action.payload };
        },
    })
);

export function createHortenCube(definition: HortenCubeDefinition): ((Alias) => HortenCube) {
    let modelCreator = createHortenCubeModel;
    let selectorsCreator = createHortenCubeSelectors;
    let helperCreator = createHortenCubeHelpers;
    let epicCreator = createHortenCubeEpic;
    let reducerCreator = createHortenCubeReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}