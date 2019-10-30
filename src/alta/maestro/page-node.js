import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {GraphStavanger} from "./graph-node";
import type {HortenNode} from "../horten/node";
import type {HortenPage} from "../horten/page";

export interface NodeStavanger {
    page: HortenPage
}

export interface PageStavanger {
    page: HortenPage,
    node: HortenNode,
}

export const pageNodeMaestro = (pageStavanger: PageStavanger, nodeStavanger: NodeStavanger): Epic  => {

    // This allows for
    let node = nodeStavanger ? nodeStavanger.node : pageStavanger.node
    let page = pageStavanger.page

    //TODO: Set Node Output to FlowDiagram
    const onPageStartedRegisterWithNode = (action$, state$) =>
        action$.pipe(
            ofType(page.model.initPage.request),
            mergeMap(action => {

                    return [node.model.setModel.request(action.payload.node),]
                }
            ));





    return combineEpics(onPageStartedRegisterWithNode)
}