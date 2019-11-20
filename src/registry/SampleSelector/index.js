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
import {DEF_BIOIMAGE, DEF_LOCKER, DEF_SAMPLE, DEF_USER} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createHortenNode} from "../../alta/horten/node";
import {createHortenMold} from "../../alta/horten/mold";
import type {HortenNode} from "../../alta/horten/node";


export type  SampleSelectorStavanger = Stavanger &{
    user: HortenValue,
    locker: HortenValue,
    bioimage: HortenValue,
    samples: HortenTable,
    node: HortenNode,
    settings: HortenForm


}
export const ports = {
    ins: [
        { name: "Locker" , type: constants.LOCKER, map: "locker" },
        { name: "Experiment" , type: constants.EXPERIMENT, map: "experiments"},
        { name: "Creator" , type: constants.CREATOR, map: "creator"},
        { name: "BioImage" , type: constants.BIOIMAGE, map: "bioimage"},
    ],
    outs: [
        {name: "Sample", type: constants.SAMPLE}
    ]
}



export const sampleSelectorStavanger = createStavanger({
    node: createHortenNode({type: constants.NODE, ports: ports, isPoppable: true}),
    settings: createHortenMold({type: "settings"}),
    user: createHortenValue(DEF_USER),
    locker: createHortenValue(DEF_LOCKER),
    bioimage: createHortenValue(DEF_BIOIMAGE),
    samples: createHortenTable(DEF_SAMPLE)
})



export default connectOpera(sampleSelectorStavanger)(orchestraterEpic)(ImageMutater);