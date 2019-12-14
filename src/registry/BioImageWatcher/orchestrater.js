import {combineEpics, ofType} from "redux-observable";
import type {BioImageWatcher} from "./index";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {mergeMap, withLatestFrom} from "rxjs/operators";
import {nodeMaestro} from "../nodeMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";


export const orchestraterEpic = (stavanger: BioImageWatcher) => {



    const input = stavanger.bioimage
    const node = stavanger.node

    const addin1 = nodeMaestro(stavanger , null)


    //TODO: Set Node Output to FlowDiagram
    const onInputModelIsSetAndStartPressed = (action$, state$) =>
        action$.pipe(
            ofType(node.model.dynamic("START").request),
            withLatestFrom(action$.ofType(input.model.setItem.request)),
            mergeMap((actions) => {
                    let dataStructure = actions[1].payload;
                    return [node.model.setOut("bioimage").request(dataStructure)]
                }
                )
            )


    const apiConnections = combineEpics(
        itemConnector(stavanger.bioimage),
        apiConnector(stavanger.bioimages)
    )

    return combineOrchestrator(stavanger, {
            apiConnections,
            addin1,
            onInputModelIsSetAndStartPressed,
        })
}

export default orchestraterEpic