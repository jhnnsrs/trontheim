import {createHortenItem} from "../alta/horten/item";
import * as constants from "../constants";
import {createHortenTable} from "../alta/horten/table";
import {
    DEF_EXTERNAL,
    DEF_EXTERNALREQUEST, DEF_FLOW,
    DEF_GRAPH,
    DEF_LAYOUT,
    DEF_NODE,
    DEF_REGISTRY, DEF_SETTINGS
} from "../constants/definitions";
import {createHortenPage} from "../alta/horten/page";
import {createHortenRegistry} from "../alta/horten/registry";
import {createHortenGraph} from "../alta/horten/graph";
import type {FlowStavanger} from "../maestros/flowMeastro";
import {combineEpics} from "redux-observable";
import {apiConnector, itemConnector} from "../rootMaestros";
import {createHortenNode} from "../alta/horten/node";
import {createHortenMold} from "../alta/horten/mold";


export const  createNodeConductor = ({ports, isPoppable}) => ({
    node: createHortenNode({type: constants.NODE, ports: ports, isPoppable}),
    settings: createHortenMold(DEF_SETTINGS),
})

