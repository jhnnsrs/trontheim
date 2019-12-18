import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {
    DEF_EXHIBIT,
    DEF_EXPERIMENT,
    DEF_REPRESENTATION,
    DEF_ROI,
    DEF_SAMPLE, DEF_TRANSFORMATION,
    DEF_USER
} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type  ExperimentSelector = NodeStavanger &{
    user: HortenValue,
    sample: HortenValue,
    roi: HortenValue,
    representation: HortenValue,
    transformations: HortenTable,

}
export const ports = {
    ins: [
        { name: "user" , type: constants.USER, map: "user" },
        { name: "sample" , type: constants.SAMPLE, map: "sample" },
        { name: "roi" , type: constants.ROI, map: "roi" },
        { name: "representation" , type: constants.REPRESENTATION, map: "representation" },
    ],
    outs: [
        {name: "transformation", type: constants.TRANSFORMATION}
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})

export const exhibitSelector = createStavanger({
    ...nodeConductor,
    user: createHortenValue(DEF_USER),
    sample: createHortenValue(DEF_SAMPLE),
    roi: createHortenValue(DEF_ROI),
    representation: createHortenValue(DEF_REPRESENTATION),
    transformations: createHortenTable(DEF_TRANSFORMATION)
})



export default connectOpera(exhibitSelector)(orchestraterEpic)(ImageMutater);