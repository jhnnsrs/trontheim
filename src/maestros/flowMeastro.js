import rootStavanger from "../rootStavanger";
import {ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import {combineOrchestrator} from "../alta/react/EpicRegistry";
import type {GraphCurtainDefinition, GraphCurtainStavanger} from "./graphCurtainMaestro";
import type {GraphLayoutStavanger} from "./graphFlowLayoutMaestro";
import type {GraphRegistryStavanger} from "./graphRegistryMaestro";
import type {CurtainExternalStavanger} from "./curtainExternalMaestro";
import {graphRegistryMaestro} from "./graphRegistryMaestro";
import {graphFlowLayoutMaestro} from "./graphFlowLayoutMaestro";
import {curtainExternalMaestro} from "./curtainExternalMaestro";
import {graphCurtainMaestro} from "./graphCurtainMaestro";

export interface FlowStavanger extends GraphCurtainStavanger, GraphLayoutStavanger, GraphRegistryStavanger, CurtainExternalStavanger {

}



export const flowMaestro = (stavanger: FlowStavanger, definition: GraphCurtainDefinition) => {

    const m_graphCurtain = graphCurtainMaestro(stavanger, definition)
    const m_graphRegistry = graphRegistryMaestro(stavanger, definition)
    const m_graphLayout = graphFlowLayoutMaestro(stavanger, definition)
    const m_curtainExternal = curtainExternalMaestro(stavanger, definition)



    return combineOrchestrator(stavanger, {
        m_graphCurtain,
        m_graphRegistry,
        m_graphLayout,
        m_curtainExternal,
        }
    )
}