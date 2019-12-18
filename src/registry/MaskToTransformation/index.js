import {createStavanger} from "../../alta/stavanger";
import {MaxISP} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {
    DEF_BIOSERIES,
    DEF_CONVERSING, DEF_MASK,
    DEF_REPRESENTATION, DEF_REVAMPING,
    DEF_SAMPLE,
    DEF_TRANSFORMATION
} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";


export type MaskRevampingStavanger = NodeStavanger &{
    transformation: HortenItem,
    mask: HortenItem,
    revampings: HortenTable,
    transformations: HortenTable,

}

export const ports = {
    ins: [
        { name: "transformation" , type: constants.TRANSFORMATION, map: "transformation" },
        { name: "mask" , type: constants.MASK, map: "mask" },
    ],
    outs: [
        {name: "transformation", type: constants.TRANSFORMATION},
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})

export const maskRevampingStavanger = createStavanger({
    ...nodeConductor,
    transformation: createHortenItem(DEF_TRANSFORMATION),
    mask: createHortenItem(DEF_MASK),
    revampings: createHortenTable(DEF_REVAMPING),
    transformations:  createHortenTable(DEF_TRANSFORMATION),
})



export default connectOpera(maskRevampingStavanger)(orchestraterEpic)(MaxISP);