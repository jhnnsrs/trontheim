import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {createEpicMiddleware, ofType} from 'redux-observable';
import {BehaviorSubject, } from 'rxjs';
import {mergeMap, takeUntil, catchError} from 'rxjs/operators';
// import root epics/reducer
import rootEpic from './rootEpic';
import rootReducer from './rootReducer';
import {authMiddleware} from "redux-implicit-oauth2";
import reducerRegistry from "./routerRegistry";
import {composeWithDevTools} from "redux-devtools-extension";

// export `history` to use in LoginApp.js, we using `createBrowserHistory`

// Build the middleware for intercepting and dispatching navigation sta

const epic$ = new BehaviorSubject(rootEpic);

const hotReloadingEpic = (action$, ...rest) =>
	epic$.pipe(
		mergeMap(epic =>
			epic(action$, ...rest).pipe(
				takeUntil(action$.pipe(
					ofType('EPIC_END')
				)),
				catchError((error, source) => {
					console.error("Root Error | " + error);
					return source;
					})
						)
		)
	);


const epicMiddleware = createEpicMiddleware()

/* from local storage or server */
const initialState = {}


const combine = (reducers) => {
	const reducerNames = Object.keys(reducers);
	Object.keys(initialState).forEach(item => {
		if (reducerNames.indexOf(item) === -1) {
			reducers[item] = (state = null) => state;
		}
	});
	return combineReducers(reducers);
};


const store = createStore(
	combine(rootReducer),
	applyMiddleware(authMiddleware,epicMiddleware)
);

epicMiddleware.run(hotReloadingEpic)


// store = createStore(reducer, initialState);






reducerRegistry.setChangeListener(reducers => {
	store.replaceReducer(combine(reducers));
});



export default store;
