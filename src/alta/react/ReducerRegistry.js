import {combineReducers} from "redux";
import routerRegistry from "../../routerRegistry";
import type {Stavanger} from "../stavanger";
import type {Horten} from "../horten/types";

export const registerStavangerReducers = (stavanger: Stavanger, alias: ALIAS ): void  => {

    let reducerlist = {}
    for (let i in stavanger) {
        let currentHorten: Horten = stavanger[i]
        if (currentHorten.alias == alias.toLowerCase()){
            reducerlist[i] = currentHorten.reducer
        }
    }
    let reducer = combineReducers(reducerlist)

    routerRegistry.register(alias.toLowerCase(),reducer)
}