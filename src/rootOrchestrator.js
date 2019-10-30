import {combineEpics, ofType} from "redux-observable";
import { mergeMap,} from "rxjs/operators";
import type {RootStavanger} from "./rootStavanger";
import {veilRestApiMaestro} from "./alta/maestro/veil-restapi";


export const rootOrchestrater = (stavanger: RootStavanger) => {



    const getUserForTakenTakeOut = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.user.model.getUserForToken.request),
            mergeMap(action => {
                let {token, rooturl} = action.payload
                let meta = {
                    actions: stavanger.user.model.setUser, //This will use the result and set the User
                    method: "GET_LIST",
                    suburl: stavanger.user.definition.url,
                }
                return [stavanger.api.model.ApiRequest.request({data: {}, meta: meta})]
            }));


    const veilConnection = veilRestApiMaestro(stavanger.api)(stavanger.oslo)(stavanger.veil)





    return combineEpics(
        getUserForTakenTakeOut,veilConnection)
}

export default rootOrchestrater