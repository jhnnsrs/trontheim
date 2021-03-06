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
import {
    DEF_CLUSTERDATA,
    DEF_CUBE,
    DEF_EXHIBIT, DEF_LENGTHDATA,
    DEF_MASK,
    DEF_REFLECTION,
    DEF_ROI,
    DEF_TRANSFORMATION
} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createNodeConductor} from "../../conductors/createNodeConductor";


export type  ReflectionShowStavanger = NodeStavanger &{
    lengthdata: HortenValue,
    reflectionin: HortenValue,
    reflection: HortenItem,

}

export const ports = {
    ins: [
        { name: "lengthdata" , type: constants.LENGTHDATA, map: "lengthdata" },
        { name: "reflection" , type: constants.REFLECTION, map: "reflectionin" },
    ],
    outs: [
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})

export const exhibitShowStavanger = createStavanger({
    ...nodeConductor,
    lengthdata: createHortenItem(DEF_LENGTHDATA),
    reflectionin: createHortenValue(DEF_REFLECTION),
    reflection: createHortenItem(DEF_REFLECTION),
})




export default connectOpera(exhibitShowStavanger)(orchestraterEpic)(TwoDShow);