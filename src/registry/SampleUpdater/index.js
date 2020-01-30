import {createStavanger} from "../../alta/stavanger";
import ExperimentAdder from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import {DEF_ANIMAL, DEF_EXPERIMENT, DEF_EXPERIMENTALGROUP, DEF_SAMPLE} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type  SampleUpdaterStavanger = NodeStavanger &{
    sample: HortenItem,
    experiment: HortenValue,
    animal: HortenValue,
    experimentalgroup: HortenValue,
    sampleout: HortenItem,


}
export const ports = {
    ins: [
        { name: "sample" , type: constants.SAMPLE, map: "sample"},
        { name: "experiment" , type: constants.EXPERIMENT, map: "experiment"},
        { name: "animal" , type: constants.ANIMAL, map: "animal"},
        { name: "experimentalgroup" , type: constants.EXPERIMENTALGROUP, map: "experimentalgroup"},
    ],
    outs: [
        {name: "sample", type: constants.SAMPLE}
    ]
}

const nodeConductor = createNodeConductor({ports: ports})

export const sampleUpdaterStavanger = createStavanger({
    ...nodeConductor,
    sample: createHortenItem(DEF_SAMPLE),
    sampleout: createHortenItem(DEF_SAMPLE),
    experimentalgroup: createHortenValue(DEF_EXPERIMENTALGROUP),
    experiment: createHortenValue(DEF_EXPERIMENT),
    animal: createHortenValue(DEF_ANIMAL)
})



export default connectOpera(sampleUpdaterStavanger)(orchestraterEpic)(ExperimentAdder);