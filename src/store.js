import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {createEpicMiddleware, ofType} from 'redux-observable';
import {BehaviorSubject} from 'rxjs';
import {mergeMap, takeUntil} from 'rxjs/operators';
// import root epics/reducer
import rootEpic from './rootEpic';
import rootReducer from './rootReducer';
import {authMiddleware} from "redux-implicit-oauth2";
import reducerRegistry from "./routerRegistry";

// export `history` to use in LoginApp.js, we using `createBrowserHistory`

// Build the middleware for intercepting and dispatching navigation sta

const epic$ = new BehaviorSubject(rootEpic);

const hotReloadingEpic = (action$, ...rest) =>
	epic$.pipe(
		mergeMap(epic =>
			epic(action$, ...rest).pipe(
				takeUntil(action$.pipe(
					ofType('EPIC_END')
				))
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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&

	window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
		//actionSanitizer: (action) => ({ ...action, meta: "WITH_META"}),
		trace: true,
		traceLimit: 25
	}) || compose


const store = createStore(
	combine(rootReducer),
	composeEnhancers(
		applyMiddleware(authMiddleware,epicMiddleware),
	)
);

epicMiddleware.run(hotReloadingEpic)


// store = createStore(reducer, initialState);






reducerRegistry.setChangeListener(reducers => {
	store.replaceReducer(combine(reducers));
});



export default store;
