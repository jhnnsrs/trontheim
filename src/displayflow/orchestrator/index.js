import {combineEpics} from "redux-observable";
import type {DisplayFlowStavanger} from "../stavanger";
import {itemConnector} from "../../rootMaestros";
import {flowMaestro} from "../../maestros/flowMeastro";
import {createFlowApi} from "../../conductors/createFlowConductor";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";

export const orchestraterEpic = (stavanger: DisplayFlowStavanger) => {


    const m_flow = flowMaestro(stavanger, {
        initial: stavanger.display,
        paramsMap: (params) => ({ initialid: params.displayid, flowid: params.flowid})
    })


    const apiConnections = combineEpics(
        itemConnector(stavanger.display),
        createFlowApi(stavanger)
    )

    return combineOrchestrator(stavanger, {
            m_flow,
            apiConnections
        }

    )
}

export default orchestraterEpic