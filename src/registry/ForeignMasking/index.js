import {createStavanger} from "../../alta/stavanger";
import ExperimentAdder from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import {DEF_IMPULS, DEF_MASK, DEF_REFLECTION, DEF_TRANSFORMATION} from "../../constants/definitions";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";
import {createHortenValue} from "../../alta/horten/value";


export type  ForeignMasking = NodeStavanger &{
    transformationin: HortenItem,
    transformationout: HortenItem,


}
export const ports = {
    ins: [
        { name: "transformation" , type: constants.TRANSFORMATION, map: "transformationin"},
    ],
    outs: [
        {name: "transformation", type: constants.TRANSFORMATION}
    ]
}

const nodeConductor = createNodeConductor({ports: ports, isPoppable: true})

export const foreignMaskingStavanger = createStavanger({
    ...nodeConductor,
    transformationin: createHortenValue(DEF_TRANSFORMATION),
    transformationout: createHortenItem(DEF_TRANSFORMATION),
})



export default connectOpera(foreignMaskingStavanger)(orchestraterEpic)(ExperimentAdder);