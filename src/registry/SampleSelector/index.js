import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_BIOIMAGE, DEF_LOCKER, DEF_SAMPLE, DEF_USER} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type  SampleSelectorStavanger = NodeStavanger &{
    user: HortenValue,
    locker: HortenValue,
    bioimage: HortenValue,
    samples: HortenTable,
}
export const ports = {
    ins: [
        { name: "locker" , type: constants.LOCKER, map: "locker" },
        { name: "experiment" , type: constants.EXPERIMENT, map: "experiments"},
        { name: "creator" , type: constants.CREATOR, map: "creator"},
        { name: "bioimage" , type: constants.BIOIMAGE, map: "bioimage"},
    ],
    outs: [
        {name: "sample", type: constants.SAMPLE}
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})

export const sampleSelectorStavanger = createStavanger({
    ...nodeConductor,
    user: createHortenValue(DEF_USER),
    locker: createHortenValue(DEF_LOCKER),
    bioimage: createHortenValue(DEF_BIOIMAGE),
    samples: createHortenTable(DEF_SAMPLE)
})



export default connectOpera(sampleSelectorStavanger)(orchestraterEpic)(ImageMutater);