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

export const pageRegistryMaestro = (pageStavanger: PageStavanger, nodesStavanger: NodesStavanger): Epic  => {

    // This allows for
    let nodes = nodesStavanger ? nodesStavanger.nodes : pageStavanger.nodes
    let page = pageStavanger.page







    return combineEpics(onPageStartedRegisterSettings)
}