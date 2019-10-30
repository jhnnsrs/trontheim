import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {GraphStavanger} from "./graph-node";
import type {HortenNode} from "../horten/node";
import type {HortenPage} from "../horten/page";
import type {HortenEdge} from "../horten/edge";

export interface EdgeStavanger {
    edge: HortenPage
}

export interface PageStavanger {
    page: HortenPage,
    edge: HortenEdge,
}

export const pageEdgeMaestro = (pageStavanger: PageStavanger, nodeStavanger: EdgeStavanger): Epic  => {

    // This allows for
    let edge = nodeStavanger ? nodeStavanger.edge : pageStavanger.edge
    let page = pageStavanger.page

    //TODO: Set Node Output to FlowDiagram
    const onPageStartedRegisterWithNode = (action$, state$) =>
        action$.pipe(
            ofType(page.model.initPage.request),
            mergeMap(action => {

                    return [edge.model.setModel.request(action.payload.node),]
                }
            ));

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





    return combineEpics(onPageStartedRegisterWithNode,onPageKillResetModel)
}