import handleActions from "redux-actions/es/handleActions";
import * as constants from "../../constants"
import {SubmissionError} from "redux-form";
import {Observable} from "rxjs";
import {combineEpics, Epic, ofType} from "redux-observable";
import {catchError, delay, mergeMap} from "rxjs/operators";
import reduceReducers from "reduce-reducers";
import {createHaldenOsloActions} from "../../halden";
import type {HaldenActions} from "../../oslo";
import {createStavangerFormSelector} from "../form";

export type HortenValidator = any
export type HortenWithForm<T> = T & {
    model: { ...T.model, submitItem: HaldenActions}
}

export function withForm<T>(validator: HortenValidator, horten: T): HortenWithForm<T> {
    let newInitialState = {...horten.initialState};
    let submitAction = createHaldenOsloActions(horten.alias, horten.type, "SUBMIT_ITEM");

    let formReducer = handleActions(
        {
            [submitAction.request]: (state, action) => {
                return {...state, meta: {...state.meta, loading: true, status: constants.VALIDATING}}
            },
            [submitAction.success]: (state, action) => {
                return { ...state, meta: {...state.meta, loading: false, status: constants.VALIDATED }}
            },
        },
        newInitialState);

    async function onSubmit (formValues, dispatch) {
        try {
            await new Promise((resolve, reject) => {
                dispatch({
                    type: submitAction.request.toString(), // or whatever you call it
                    payload: {data: formValues, meta: {error: false, status: constants.SUBMITTING}},
                    meta: { // why meta? https://github.com/redux-utilities/flux-standard-action#meta
                        resolve,
                        reject
                    }
                })
            })

        } catch (err) {
            throw new SubmissionError(err) // imported from `redux-form`
        }
    }

    let submitEpic = (action$: Observable, state$: Observable): Epic =>
        action$.pipe(
            ofType(submitAction.request.toString()),
            mergeMap(action => {
                let { resolve, reject } = action.meta || {};
                return Observable.of(1).pipe( // fake network request
                    delay(1000),
                    mergeMap(res => {
                        // pretend that the server does this verification
                        validator(action, state$.value)
                        if (resolve) resolve(res); // :eyes: -- resume redux-form `onSubmit` function
                        return [submitAction.success(action.payload)];
                    }),
                    catchError(error => {
                        if (reject) reject(error); // :eyes:
                        return [submitAction.failure(error)];
                    }),
                );
            }),
        );

    return ({
        ...horten,
        model: {...horten.model, submitItem: submitAction},
        epic: combineEpics(horten.epic, submitEpic),
        helpers: {...horten.helpers, onSubmit: onSubmit},
        reducer: reduceReducers(horten.reducer, formReducer, newInitialState),
        selectors: {...horten.selectors, ...createStavangerFormSelector(horten.ALIAS)},
        initialState: newInitialState,
    });
}