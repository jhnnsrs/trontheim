import {combineEpics} from "redux-observable";
import type {LineTransformer} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {taskConductor} from "../../alta/conductor/taskconductor";
import {userIDPortal} from "../../portals";
import {nodeMaestro} from "../nodeMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";


export const orchestraterEpic = (stavanger: LineTransformer) => {

    const moduleMaestro = nodeMaestro(stavanger)



    const apiConnections = combineEpics(
        itemConnector(stavanger.roi),
        itemConnector(stavanger.representation),
        apiConnector(stavanger.transformations),
        apiConnector(stavanger.transformings)
    )

    return combineOrchestrator(stavanger, {
        apiConnections,
        moduleMaestro
    })
}

export default orchestraterEpic