import {createStavanger} from "../../alta/stavanger";
import {MaxISP} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_BIOSERIES, DEF_CONVERSING, DEF_REPRESENTATION, DEF_SAMPLE} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type BioConverter = NodeStavanger &{
    bioseries: HortenValue,
    representations: HortenTable,
    samples: HortenTable,
    conversings: HortenTable,


}

export const ports = {
    ins: [
        { name: "bioseries" , type: constants.BIOSERIES, map: "bioseries" },
    ],
    outs: [
        {name: "sample", type: constants.SAMPLE},
        {name: "representation", type: constants.REPRESENTATION}
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})

export const bioConverterStavanger = createStavanger({
    ...nodeConductor,
    bioseries: createHortenValue(DEF_BIOSERIES),
    conversings: createHortenTable(DEF_CONVERSING),
    samples:  createHortenTable(DEF_SAMPLE),
    representations:  createHortenTable(DEF_REPRESENTATION),
})



export default connectOpera(bioConverterStavanger)(orchestraterEpic)(MaxISP);