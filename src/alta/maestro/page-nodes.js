import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HortenPage} from "../horten/page";
import type {HortenNodes} from "../horten/nodes";

export interface NodesStavanger {
    nodes: HortenNodes
}

export interface PageStavanger {
    page: HortenPage,
    nodes: HortenNodes
}

export const pageNodesMaestro = (pageStavanger: PageStavanger, nodesStavanger: NodesStavanger): Epic  => {

    // This allows for
    let nodes = nodesStavanger ? nodesStavanger.nodes : pageStavanger.nodes
    let page = pageStavanger.page

    //TODO: Set Node Output to FlowDiagram
    const onPageStartedRegisterSettings = (action$, state$) =>
        action$.pipe(
            ofType(page.model.initPage.request),
            mergeMap(action => {
                    return [nodes.model.registerNode.request(action.payload.node)]
                }
            ));





    return combineEpics(onPageStartedRegisterSettings)
}