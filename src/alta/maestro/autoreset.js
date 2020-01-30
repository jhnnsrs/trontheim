import {Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HortenPage} from "../horten/page";
import type {HortenEdge} from "../horten/edge";


export interface PageStavanger {
    page: HortenPage,
    edge: HortenEdge,
}

export const autoResetMaestro = (pageStavanger: PageStavanger): Epic  => {

    // This allows for
    let page = pageStavanger.page

    //TODO: Set Node Output to FlowDiagram

    const onPageKillResetModel = (action$, state$) =>
        action$.pipe(
            ofType(page.model.killPage.request),
            mergeMap(action => {
                    let actions = Object.keys(pageStavanger).map(
                        item => {
                            try {
                                if (item == "parent") return null
                                return pageStavanger[item].model.reset.request({})
                            }
                            catch (e){
                                console.log(item,e)
                                return {type: "FAILURE"}
                            }
                        }
                    ).filter( item => item !== null)
                    return actions
                }
            ));





    return onPageKillResetModel
}