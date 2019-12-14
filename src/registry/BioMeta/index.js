import {createStavanger} from "../../alta/stavanger";
import {MaxISP} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_ANALYZING, DEF_BIOIMAGE, DEF_BIOSERIES} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type LineTransformer = NodeStavanger &{
    bioimage: HortenValue,
    analyzings: HortenTable,
    bioseries: HortenTable,


}

export const ports = {
    ins: [
        { name: "bioimage" , type: constants.BIOIMAGE, map: "bioimage" },
    ],
    outs: [
        {name: "bioseries", type: constants.BIOSERIES}
    ]
}

const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})

export const lineTransformerStavanger = createStavanger({
    ...nodeConductor,
    bioimage: createHortenValue(DEF_BIOIMAGE),
    analyzings: createHortenTable(DEF_ANALYZING),
    bioseries:  createHortenTable(DEF_BIOSERIES),
})



export default connectOpera(lineTransformerStavanger)(orchestraterEpic)(MaxISP);