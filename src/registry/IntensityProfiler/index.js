import {createStavanger} from "../../alta/stavanger";
import {MaxISP} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";
import {DEF_STRAINING, DEF_TRANSFORMATION} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";


export type IntensityProfiler = NodeStavanger &{
    transformation: HortenValue,
    strainings: HortenTable,
    transformations: HortenTable,


}

export const ports = {
    ins: [
        { name: "transformation" , type: constants.TRANSFORMATION, map: "transformation" },
    ],
    outs: [
        {name: "transformation", type: constants.TRANSFORMATION}
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})


export const lineTransformerStavanger = createStavanger({
    ...nodeConductor,
    transformation: createHortenValue(DEF_TRANSFORMATION),
    strainings: createHortenTable(DEF_STRAINING),
    transformations:  createHortenTable(DEF_TRANSFORMATION),
})



export default connectOpera(lineTransformerStavanger)(orchestraterEpic)(MaxISP);