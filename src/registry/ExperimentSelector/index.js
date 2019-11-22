import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenForm} from "../../alta/horten/form";
import {createHortenForm} from "../../alta/horten/form";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import {DEF_BIOIMAGE, DEF_EXPERIMENT, DEF_LOCKER, DEF_SAMPLE, DEF_USER} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createHortenNode} from "../../alta/horten/node";
import {createHortenMold} from "../../alta/horten/mold";
import type {HortenNode} from "../../alta/horten/node";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type  ExperimentSelector = NodeStavanger &{
    user: HortenValue,
    experiments: HortenTable,
}
export const ports = {
    ins: [
        { name: "user" , type: constants.USER, map: "user" },
    ],
    outs: [
        {name: "experiment", type: constants.EXPERIMENT}
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: true})

export const experimentSelector = createStavanger({
    ...nodeConductor,
    user: createHortenValue(DEF_USER),
    experiments: createHortenTable(DEF_EXPERIMENT)
})



export default connectOpera(experimentSelector)(orchestraterEpic)(ImageMutater);