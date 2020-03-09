import {createStavanger} from "../../alta/stavanger";
import {NodeContainer} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {
    DEF_EXHIBIT,
    DEF_METAMORPHING,
    DEF_MUTATING, DEF_REFLECTION,
    DEF_REPRESENTATION,
    DEF_TRANSFORMATION
} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import type {NodeStavanger} from "../lib/types";
import {createNodeConductor} from "../../conductors/createNodeConductor";


export type TransformationMutater = NodeStavanger &{
    transformation: HortenValue,
    reflections: HortenTable,
    mutatings: HortenTable,


}

export const ports = {
    ins: [
        { name: "transformation" , type: constants.TRANSFORMATION, map: "transformation" },
    ],
    outs: [
        {name: "reflection", type: constants.REFLECTION}
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})

export const transformationMutater = createStavanger({
    ...nodeConductor,
    transformation: createHortenValue(DEF_TRANSFORMATION),
    mutatings: createHortenTable(DEF_MUTATING),
    reflections:  createHortenTable(DEF_REFLECTION),
})



export default connectOpera(transformationMutater)(orchestraterEpic)(NodeContainer);