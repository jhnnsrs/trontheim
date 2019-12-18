import {createHortenItem} from "../alta/horten/item";
import * as constants from "../constants";
import {createHortenTable} from "../alta/horten/table";
import {
    DEF_EXTERNAL,
    DEF_EXTERNALREQUEST, DEF_FLOW,
    DEF_GRAPH,
    DEF_LAYOUT,
    DEF_NODE,
    DEF_REGISTRY
} from "../constants/definitions";
import {createHortenPage} from "../alta/horten/page";
import {createHortenRegistry} from "../alta/horten/registry";
import {createHortenGraph} from "../alta/horten/graph";
import type {FlowStavanger} from "../maestros/flowMeastro";
import {combineEpics} from "redux-observable";
import {apiConnector, itemConnector} from "../rootMaestros";


export const  createFlowConductor = () => ({
    page: createHortenPage({type: "page", reset: true}), // Overwrites Standard Flows SHOULD always reload (otherwise flows will load the same modules as before which is not desirable (because of Flow->Nodes->Registry linkage)
    registry: createHortenRegistry(DEF_REGISTRY),
    flow: createHortenItem(DEF_FLOW),
    graph: createHortenGraph(DEF_GRAPH),
    selectedLayout: createHortenItem(DEF_LAYOUT),
    availableLayouts: createHortenTable(DEF_LAYOUT),
    externals: createHortenTable(DEF_EXTERNAL),
    externalrequests: createHortenTable(DEF_EXTERNALREQUEST),
})

export const createFlowApi = (stavanger: FlowStavanger) => combineEpics(
    itemConnector(stavanger.selectedLayout),
    itemConnector(stavanger.flow),
    apiConnector(stavanger.externals),
    apiConnector(stavanger.externalrequests),
    apiConnector(stavanger.availableLayouts),
    )