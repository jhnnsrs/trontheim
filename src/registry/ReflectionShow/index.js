import {createStavanger} from "../../alta/stavanger";
import {TwoDShow} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenCube} from "../../alta/horten/cube";
import {createHortenCube} from "../../alta/horten/cube";
import type {NodeStavanger} from "../lib/types";
import {DEF_CUBE, DEF_EXHIBIT, DEF_MASK, DEF_REFLECTION, DEF_ROI} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createNodeConductor} from "../../conductors/createNodeConductor";


export type  ReflectionShowStavanger = NodeStavanger &{
    reflectionin: HortenValue,
    masks: HortenTable,
    reflection: HortenItem,

}

export const ports = {
    ins: [
        { name: "reflection" , type: constants.REFLECTION, map: "reflectionin" },
    ],
    outs: [
        {name: "mask", type: constants.MASK}
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})

export const exhibitShowStavanger = createStavanger({
    ...nodeConductor,
    reflectionin: createHortenValue(DEF_REFLECTION),
    reflection: createHortenItem(DEF_REFLECTION),
    masks: createHortenTable(DEF_MASK),
})




export default connectOpera(exhibitShowStavanger)(orchestraterEpic)(TwoDShow);