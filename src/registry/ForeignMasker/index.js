import {createStavanger} from "../../alta/stavanger";
import ExperimentAdder from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import {DEF_IMPULS, DEF_MASK, DEF_REFLECTION} from "../../constants/definitions";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";
import {createHortenValue} from "../../alta/horten/value";


export type  ImpulsorStavanger = NodeStavanger &{
    reflection: HortenItem,
    mask: HortenItem,


}
export const ports = {
    ins: [
        { name: "reflection" , type: constants.REFLECTION, map: "reflection"},
    ],
    outs: [
        {name: "mask", type: constants.MASK}
    ]
}

const nodeConductor = createNodeConductor({ports: ports, isPoppable: true})

export const impulsorStavanger = createStavanger({
    ...nodeConductor,
    reflection: createHortenValue(DEF_REFLECTION),
    mask: createHortenItem(DEF_MASK),
})



export default connectOpera(impulsorStavanger)(orchestraterEpic)(ExperimentAdder);