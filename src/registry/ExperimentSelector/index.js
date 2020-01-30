import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_EXPERIMENT, DEF_USER} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
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