import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_EXHIBIT, DEF_EXPERIMENT, DEF_REPRESENTATION, DEF_SAMPLE, DEF_USER} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type  ExperimentSelector = NodeStavanger &{
    user: HortenValue,
    sample: HortenValue,
    experiment: HortenValue,
    representation: HortenValue,
    exhibits: HortenTable,

}
export const ports = {
    ins: [
        { name: "user" , type: constants.USER, map: "user" },
        { name: "sample" , type: constants.SAMPLE, map: "sample" },
        { name: "experiment" , type: constants.EXPERIMENT, map: "experiment" },
        { name: "representation" , type: constants.REPRESENTATION, map: "representation" },
    ],
    outs: [
        {name: "exhibit", type: constants.EXHIBIT}
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})

export const exhibitSelector = createStavanger({
    ...nodeConductor,
    user: createHortenValue(DEF_USER),
    sample: createHortenValue(DEF_SAMPLE),
    experiment: createHortenValue(DEF_EXPERIMENT),
    representation: createHortenValue(DEF_REPRESENTATION),
    exhibits: createHortenTable(DEF_EXHIBIT)
})



export default connectOpera(exhibitSelector)(orchestraterEpic)(ImageMutater);