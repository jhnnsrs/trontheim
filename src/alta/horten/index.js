// @flow

import type {
    Alias,
    Horten,
    HortenApiCreator,
    HortenEpicCreator,
    HortenHelperCreator,
    HortenModelCreator,
    HortenReducerCreator,
    HortenSelectorsCreator,
    HortenType
} from "./types";


export function createHorten<M,A,S,H,D>(type: HortenType,
                                           modelCreator: HortenModelCreator<M>,
                                           apiCreator: HortenApiCreator<A>,
                                           selectorsCreator: HortenSelectorsCreator<S>,
                                           helperCreator: HortenHelperCreator<H>,
                                           epicCreator: HortenEpicCreator<M,S>,
                                           reducerCreator: HortenReducerCreator<M>,
                                        ...restArgs): (Alias => Horten<M,A,S,H,D>) {

    return function (alias: Alias, key: string): Horten<M,A,S,H,D> {
        alias = alias.toLowerCase()
        type = type.toLowerCase()
        const selectors = selectorsCreator(alias, key);
        const model = modelCreator(alias, type, key);
        const api = apiCreator(alias,type);
        const reducer = reducerCreator(model);
        const epic = epicCreator(model, selectors, api, ...restArgs)
        const helper = helperCreator(alias,type, model, selectors, ...restArgs)

        const horten = {
            model: model,
            selectors: selectors,
            api: api,
            reducer: reducer,
            helpers: helper,
            epic: epic,
            alias: alias,
            type: type,
            key: key,
            definition: null,
            defaultState: reducer(undefined, {type: "NANANA"})
        }
        return horten
    }
}

export type Definition = {
    type: HortenType
}

export function createHorten2<M,S,H,D>(definition: Definition,
                                        modelCreator: HortenModelCreator<M>,
                                        selectorsCreator: HortenSelectorsCreator<S>,
                                        helperCreator: HortenHelperCreator<H>,
                                        epicCreator: HortenEpicCreator<M,S>,
                                        reducerCreator: HortenReducerCreator<M>,
                                        defaultState: D,
                                        restArgs: any): (Alias => Horten<M,A,S,H,D>) {

    return function (alias: Alias, key: string): Horten<M,A,S,H,D> {
        alias = alias.toLowerCase()
        let type = definition.type.toLowerCase()
        const selectors = selectorsCreator(alias, key);
        const model = modelCreator(alias, type, key, restArgs);
        const reducer = reducerCreator(model, defaultState);
        const helpers = helperCreator(alias,type, model, selectors, restArgs)
        const epic = epicCreator(model, selectors, helpers, definition)

        const horten = {
            model: model,
            selectors: selectors,
            reducer: reducer,
            helpers: helpers,
            epic: epic,
            alias: alias,
            type: type,
            key: key,
            definition: definition,
            defaultState: defaultState
        }
        return horten
    }
}