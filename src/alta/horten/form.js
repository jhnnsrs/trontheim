//@flow
import type {Alias, HortenApi, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten} from "./index";
import {combineEpics, Epic, ofType} from "redux-observable";
import {catchError, mergeMap, switchMap, take} from "rxjs/operators";
import {createHortenApi, createHortenHelpers, createHortenModel, createHortenSelectors} from "./creators";
import type {HaldenSelector} from "../halden";
import {createHaldenAction, createHaldenMergedSelector, createHaldenSelector} from "../halden";
import {handleActions} from "redux-actions";
import {Reducer} from "redux";
import type {HaldenActions} from "../oslo";
import * as constants from "../constants";
import {Observable, of, Subject} from "rxjs";
import {createOsloPassThroughEpic} from "../helpers";


export type HortenFormDefaultState = any

export type HortenFormModel = HortenModel &{
    submitForm: HaldenActions,
    setInitial: HaldenActions,
    initialized: HaldenActions,
    destroyed: HaldenActions,
}

export type HortenFormSelectors = HortenSelectors & {
    getInitial: HaldenSelector<HortenFormDefaultState>,
    getSubmitted: HaldenSelector<HortenFormDefaultState>,
    getMerged: HaldenSelector<HortenFormDefaultState>,
    isInitialized: HaldenSelector
}

export type HortenFormApi = HortenApi
export type HortenFormHelpers = HortenHelpers

export type HortenForm = {
    model: HortenFormModel,
    selectors: HortenFormSelectors,
    api: HortenFormApi,
    helpers: HortenFormHelpers,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenFormDefaultState
}

export const createHortenFormModel = createHortenModel({
    // This is Mainly for the FlowDiagram Interoperability
    submitForm: createHaldenAction("SUBMIT_FORM"),
    setInitial: createHaldenAction("SET_INITIAL"),
    initialized: createHaldenAction("INITIALIZED"),
    destroyed: createHaldenAction("DESTROYED"),
})

export const createHortenFormHelpers = createHortenHelpers({
    onSubmit: (alias,type,model: HortenFormModel, selectors: HortenFormSelectors) =>
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
                throw new Error(err) // imported from `redux-form`
            }
        }
    }
})

export const createHordenFormSelectors = createHortenSelectors({
    getInitial: createHaldenSelector("initialValues"),
    getSubmit: createHaldenSelector("submittedValues"),
    getMerged: createHaldenMergedSelector("initialValues","submittedValues"),
    isInitialized: createHaldenSelector("initialized"),
})


export const createHortenFormApi = createHortenApi({
    fetchItem: () => null
})


export const createHortenFormEpic = (model: HortenFormModel, selectors: HortenFormSelectors, api: HortenFormApi, ...restArgs ) => {

    // PARTSTART: EPICS
    // The Nodes Epic will carry along the EPICS of all the spawned Node
    const submitEpic =  (action$: Observable, state$: Subject): Epic =>
        action$.pipe(
            ofType(model.submitForm.request),
            mergeMap(action => {
                let { resolve, reject } = action.meta || {};
                return of(1).pipe(
                    // fake network request
                    //delay(1000),
                    mergeMap(res => {
                        // pretend that the server does this verification
                        if (restArgs["validator"]) restArgs["validator"](action, state$.value)
                        if (resolve) resolve(res); // :eyes: -- resume redux-form `onSubmit` function
                        return [model.submitForm.success(action.payload)];
                    }),
                    catchError(error => {
                        if (reject) reject(error); // :eyes:
                        return [model.submitForm.failure(error)];
                    }),
                );
            }),
        );



    const initializeWithValues = (action$, state$) =>
        action$.pipe(
            ofType(model.setInitial.request),
            switchMap((action) => {
                    if (selectors.isInitialized(state$.value) == true) {
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
        );

    const initializParseThrough = createOsloPassThroughEpic(model.initialized)
    const destroyPassThrough = createOsloPassThroughEpic(model.destroyed)


    return combineEpics(
        submitEpic,
        initializeWithValues,
        initializParseThrough,
        destroyPassThrough
    )
};

const initialFormState = {
    initialized: false,
    initialValues: null,
    submittedValues: null
};

export const createHortenFormReducer =  (model: HortenFormModel) => handleActions(
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

    },
    initialFormState
);


export function createHortenForm(type: HortenType = "form", ...restArgs): ((Alias) => HortenForm) {
    let modelCreator = createHortenFormModel;
    let apiCreator = createHortenFormApi;
    let selectorsCreator = createHordenFormSelectors;
    let helperCreator = createHortenFormHelpers;
    let epicCreator = createHortenFormEpic;
    let reducerCreator = createHortenFormReducer;

    return createHorten(type, modelCreator, apiCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, ...restArgs)
}

export const createStavangerFormSelector = (alias: ALIAS) => ({
    getForm: (state: any) => {
        // Should return an Error if Submission is Failing for some reason or just continue
        return state["form"][alias]
    }
})