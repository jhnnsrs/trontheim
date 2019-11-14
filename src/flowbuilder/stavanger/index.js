
import {createHortenGraph} from "../../alta/horten/graph";
import * as constants from "../../constants";
import {createStavanger} from "../../alta/stavanger";
import type {Stavanger} from "../../alta/stavanger";
import type {HortenNodes} from "../../alta/horten/nodes";
import type {HortenGraph} from "../../alta/horten/graph";
import {createHortenNodes} from "../../alta/horten/nodes";
import type {HortenForm} from "../../alta/horten/form";
import {createHortenForm} from "../../alta/horten/form";
import {createHortenItem} from "../../alta/horten/item";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenTable} from "../../alta/horten/table";
import type {HortenItem} from "../../alta/horten/item";

export type FlowBuilderStavanger = Stavanger & {
    nodes: HortenNodes,
    graph: HortenGraph,
    flow: HortenItem,
    flowForm: HortenForm,
    flows: HortenTable,
    nodesList: HortenTable

}


export const flowBuilderStavanger: FlowBuilderStavanger = createStavanger({
    flowForm: createHortenForm(constants.FLOW),
    graph: createHortenGraph(constants.GRAPH),
    flow: createHortenItem({type: constants.FLOW, url:"filterflows"}),
    flows: createHortenTable({type: constants.FLOW, url:"filterflows"}),
    nodesList: createHortenTable({type: constants.NODE,url: "nodes"}),
    nodes: createHortenNodes({type: "NODES"}),
})



