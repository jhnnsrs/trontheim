import {createStavanger} from "../../alta/stavanger";
import ExperimentAdder from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import {DEF_IMPULS} from "../../constants/definitions";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";
import {createHortenValue} from "../../alta/horten/value";


export type  ImpulsorStavanger = NodeStavanger &{
    impulsin: HortenItem,
    impulsout: HortenItem,


}
export const ports = {
    ins: [
        { name: constants.STAR , type: constants.STAR, map: "impulsin"},
    ],
    outs: [
        {name: "impuls", type: constants.STAR}
    ]
}

const nodeConductor = createNodeConductor({ports: ports})

export const impulsorStavanger = createStavanger({
    ...nodeConductor,
    impulsin: createHortenValue(DEF_IMPULS),
    impulsout: createHortenItem(DEF_IMPULS),
})



export default connectOpera(impulsorStavanger)(orchestraterEpic)(ExperimentAdder);