import {combineEpics, ofType} from "redux-observable";
import type {BioImageFlowStavanger} from "../stavanger";
import * as constants from "../../constants";
import {itemConnector} from "../../rootMaestros";
import {mergeMap, withLatestFrom} from "rxjs/operators";
import {userIDPortal} from "../../portals";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {flowMaestro} from "../../maestros/flowMeastro";
import {createFlowApi} from "../../conductors/createFlowConductor";
import {OsloString} from "../../constants/endpoints";

export const orchestraterEpic = (stavanger: BioImageFlowStavanger) => {

    const m_flow = flowMaestro(stavanger, {
        initial: stavanger.bioimage,
        paramsMap: (params) => ({ initialid: params.bioimageid, flowid: params.flowid})
    })


    const apiConnections = combineEpics(
        itemConnector(stavanger.bioimage),
        createFlowApi(stavanger)
    )

    return combineOrchestrator(stavanger, {
        m_flow,
        apiConnections
        }

    )
}

export default orchestraterEpic