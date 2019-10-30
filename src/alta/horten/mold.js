//@flow
import type {Alias, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten2} from "./index";
import {Epic, ofType} from "redux-observable";
import {BehaviorSubject, Observable, of, Subject} from "rxjs"
import {catchError, mergeMap, switchMap, take} from "rxjs/operators";
import {
    createHortenEpic,
    createHortenHelpers,
    createHortenModel,
    createHortenReducer,
    createHortenSelectors
} from "./creators";
import type {HaldenSelector} from "../halden";
import {createHaldenAction, createHaldenMergedSelector, createHaldenSelector} from "../halden";
import {Reducer} from "redux";
import type {HaldenActions} from "../oslo";
import * as constants from "../constants";
import {createOsloPassThroughEpic} from "../helpers";
import type {HortenFormModel} from "./form";


export type HortenMoldModel = HortenModel &{
    submitForm: HaldenActions,
    setInitial: HaldenActions,
    initialized: HaldenActions,
    destroyed: HaldenActions,
}

export type HortenMoldSelectors = HortenSelectors & {
    getInitial: HaldenSelector,
    getSubmitted: HaldenSelector,
    getMerged: HaldenSelector,
    isInitialized: HaldenSelector,
}

export type HortenMoldHelpers = HortenHelpers & {
    onSubmit: (string,string,HortenMoldModel,HortenMoldSelectors) => (any,any) => void
}
export type HortenMoldDefaultState = any


export type HortenMoldDefinition = {
    type: HortenType,
    validator: (any, any) => any

}
export type HortenMold = {
    model: HortenMoldModel,
    selectors: HortenMoldSelectors,
    helpers: HortenMoldHelpers,
    definition: HortenMoldDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenMoldDefaultState
}

export const createHortenMoldModel = createHortenModel({
    // This is Mainly for the FlowDiagram Interoperability
    submitForm: createHaldenAction("SUBMIT_FORM"),
    setInitial: createHaldenAction("SET_INITIAL"),
    initialized: createHaldenAction("INITIALIZED"),
    destroyed: createHaldenAction("DESTROYED"),
})

export const createHortenMoldHelpers = createHortenHelpers({
    onSubmit: (alias,type,model: HortenMoldModel, selectors: HortenMoldSelectors) =>
    {
        return async function(formValues, dispatch) {
            try {
                await new Promise((resolve, reject) => {
                    dispatch({
                        type: model.submitForm.request.toString(), // or whatever you call it
                        payload: {data: formValues, meta: {error: false, status: constants.SUBMITTING}},
                        meta: { // why meta? https://github.com/redux-utilities/flux-standard-action#meta
                            resolve,
                            reject
                        }
                    })
                })

            } catch (err) {
                throw new Error(err)
            }
        }
    }
})

export const createHortenMoldSelectors = createHortenSelectors({
    getInitial: createHaldenSelector("initialValues"),
    getSubmit: createHaldenSelector("submittedValues"),
    getMerged: createHaldenMergedSelector("initialValues","submittedValues"),
    isInitialized: createHaldenSelector("initialized"),
})


export const createHortenMoldEpic = createHortenEpic((model: HortenMoldModel, selectors: HortenMoldSelectors, helpers, definition: HortenMoldDefinition) => ({

    // PARTSTART: EPICS
    // The Nodes Epic will carry along the EPICS of all the spawned Node
    submitEpic: (action$: Observable, state$: Subject): Epic =>
        action$.pipe(
            ofType(model.submitForm.request),
            mergeMap(action => {
                let { resolve, reject } = action.meta || {};
                return of(1).pipe(
                    mergeMap(res => {
                        // pretend that the server does this verification
                        if (definition.validator) definition.validator(action, state$.value) //TODO: Make Validator easier validator should raise Error Wenn Problem
                        if (resolve) resolve(res); // :eyes: -- resume redux-form `onSubmit` function
                        return [model.submitForm.success(action.payload)];
                    }),
                    catchError(error => {
                        if (reject) reject(error); // :eyes:
                        return [model.submitForm.failure(error)];
                    }),
                );
            }),
        )
    ,
    initializeWithValues: (action$, state$: BehaviorSubject) =>
        action$.pipe(
            ofType(model.setInitial.request),
            switchMap((action) => {
                    if (selectors.isInitialized(state$.value)) {
                        console.log("Was already initialized")
                        return [model.setInitial.success(action.payload)]
                    }
                    else {
                        return action$.pipe(
                            ofType(model.initialized.request),
                            take(1),
                            mergeMap(() => {
                                    // WILL WAIT FOR THE INITIALIZATION OF THE FORM
                                    return [model.setInitial.success(action.payload)]
                                }
                            )
                        )
                    }
                }
            )
        )
    ,
    initializeParseThrough: createOsloPassThroughEpic(model.initialized),
    destroyPassThrough: createOsloPassThroughEpic(model.destroyed)

}));

const defaultState = {
    initialized: false,
    initialValues: null,
    submittedValues: null
};

export const createHortenMoldReducer =  createHortenReducer((model: HortenFormModel) => (
    {
        [model.submitForm.request]: (state, action) => {
            return {...state, meta: {...state.meta, loading: true, status: constants.VALIDATING}}
        },
        [model.submitForm.success]: (state, action) => {
            return { ...state, meta: {...state.meta, loading: false, status: constants.VALIDATED }, submittedValues: action.payload}
        },
        [model.setInitial.success]: (state, action) => {
            return { ...state, meta: {...state.meta, loading: false, status: constants.VALIDATED }, initialValues: action.payload}
        },
        [model.initialized.success]: (state, action) => {
            return { ...state, initialized: true}
        },
        [model.destroyed.success]: (state, action) => {
            return { ...state, initialized: false}
        },

    }
));


export function createHortenMold(definition: HortenMoldDefinition): ((Alias) => HortenMold) {
    let modelCreator = createHortenMoldModel;
    let selectorsCreator = createHortenMoldSelectors;
    let helperCreator = createHortenMoldHelpers;
    let epicCreator = createHortenMoldEpic;
    let reducerCreator = createHortenMoldReducer;

    return createHorten2(definition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}

