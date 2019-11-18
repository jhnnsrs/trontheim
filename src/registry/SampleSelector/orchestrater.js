import {combineEpics, ofType} from "redux-observable";
import type {SampleSelectorStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector} from "../../rootMaestros";
import {selectionConductor} from "../../alta/conductor/selectionConductor";
import {mergeMap} from "rxjs/operators";
import type {HortenGraph} from "../../alta/horten/graph";
import type {HortenRegistry} from "../../alta/horten/registry";


export const orchestraterEpic = (stavanger: SampleSelectorStavanger) => {

    const input = stavanger.locker
    const node = stavanger.node
    const page = stavanger.page

    const graph: HortenGraph = stavanger.parent.graph
    const registry: HortenRegistry = stavanger.parent.registry

    const onPageInitRegisterNode = (action$, state$) =>
        action$.pipe(
            ofType(page.model.initPage.success),
            mergeMap((action) => {
                    console.log(action)
                    return [registry.model.register(node.alias).request(node.alias)]
                }
            )
        )


    const apiConnections = combineEpics(
        apiConnector(stavanger.samples)
    )

    return combineEpics(
        apiConnections,
        onPageInitRegisterNode,
    )
}

export default orchestraterEpic