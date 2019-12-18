import {createStavanger} from "../../alta/stavanger";
import ExperimentAdder from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import {DEF_IMPULS, DEF_LENGTHDATA, DEF_MASK, DEF_REFLECTION, DEF_TRANSFORMATION} from "../../constants/definitions";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";
import {createHortenValue} from "../../alta/horten/value";


export type  ForeignLength = NodeStavanger &{
    transformation: HortenItem,
    lengthdata: HortenItem,


}
export const ports = {
    ins: [
        { name: "transformation" , type: constants.TRANSFORMATION, map: "transformation"},
        { name: "reflection" , type: constants.REFLECTION, map: "reflection"},
    ],
    outs: [
        {name: "lengthdata", type: constants.LENGTHDATA}
    ]
}

const nodeConductor = createNodeConductor({ports: ports, isPoppable: true})

export const impulsorStavanger = createStavanger({
    ...nodeConductor,
    transformation: createHortenValue(DEF_TRANSFORMATION),
    reflection: createHortenValue(DEF_REFLECTION),
    lengthdata: createHortenItem(DEF_LENGTHDATA),
})



export default connectOpera(impulsorStavanger)(orchestraterEpic)(ExperimentAdder);