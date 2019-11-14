import * as constants from "../../constants";
import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import type {HortenNodes} from "../../alta/horten/nodes";
import {createHortenNodes} from "../../alta/horten/nodes";
import type {HortenForm} from "../../alta/horten/form";
import {createHortenForm} from "../../alta/horten/form";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenNomogram} from "../../alta/horten/nomogram";
import {createHortenNomogram} from "../../alta/horten/nomogram";

export type FlowBuilderStavanger = Stavanger & {
    nodes: HortenNodes,
    graph: HortenNomogram,
    flow: HortenItem,
    flowForm: HortenForm,
    flows: HortenTable,
    nodesList: HortenTable

}


export const flowBuilderStavanger: FlowBuilderStavanger = createStavanger({
    flowForm: createHortenForm(constants.FLOW),
    graph: createHortenNomogram({type: constants.GRAPH}),
    flow: createHortenItem({type: constants.FLOW, url:"filterflows"}),
    flows: createHortenTable({type: constants.FLOW, url:"filterflows"}),
    nodesList: createHortenTable({type: constants.NODE,url: "nodes"}),
    nodes: createHortenNodes({type: "NODES"}),
})



