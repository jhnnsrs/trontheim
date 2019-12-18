import {createStavanger} from "../../alta/stavanger";
import {MaxISP} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";
import {DEF_CLUSTERDATA, DEF_EVALUATING, DEF_TRANSFORMATION} from "../../constants/definitions";


export type LineTransformer = NodeStavanger &{
    transformation: HortenItem,
    evaluatings: HortenTable,
    clusterdata: HortenTable,


}

export const ports = {
    ins: [
        { name: "transformation" , type: constants.TRANSFORMATION, map: "transformation" },
    ],
    outs: [
        {name: "clusterdata", type: constants.CLUSTERDATA}
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})


export const lineTransformerStavanger = createStavanger({
    ...nodeConductor,
    transformation: createHortenItem(DEF_TRANSFORMATION),
    evaluatings: createHortenTable(DEF_EVALUATING),
    clusterdata:  createHortenTable(DEF_CLUSTERDATA),
})



export default connectOpera(lineTransformerStavanger)(orchestraterEpic)(MaxISP);