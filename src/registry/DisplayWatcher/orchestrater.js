import {combineEpics, ofType} from "redux-observable";
import type {DisplayWatcherStavanger} from "./index";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {mergeMap, withLatestFrom} from "rxjs/operators";
import {nodeMaestro} from "../nodeMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";


export const orchestraterEpic = (stavanger: DisplayWatcherStavanger) => {

    const input = stavanger.display
    const node = stavanger.node

    const addin1 = nodeMaestro(stavanger , null)


    //TODO: Set Node Output to FlowDiagram
    const onInputModelIsSetAndStartPressed = (action$, state$) =>
        action$.pipe(
            ofType(node.model.dynamic("START").request),
            withLatestFrom(action$.ofType(input.model.setItem.request)),
            mergeMap((actions) => {
                    let dataStructure = actions[1].payload;
                    return [node.model.setOut("display").request(dataStructure)]
                }
                )
            )


    const apiConnections = combineEpics(
        itemConnector(stavanger.display),
        apiConnector(stavanger.displays)
    )

    return combineOrchestrator(stavanger, {
            apiConnections,
            addin1,
            onInputModelIsSetAndStartPressed,
        })
}

export default orchestraterEpic