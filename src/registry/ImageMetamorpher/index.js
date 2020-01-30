import {createStavanger} from "../../alta/stavanger";
import {NodeContainer} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_DISPLAY, DEF_METAMORPHING, DEF_REPRESENTATION} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import type {NodeStavanger} from "../lib/types";
import {createNodeConductor} from "../../conductors/createNodeConductor";


export type ExhibitMetamorpher = NodeStavanger &{
    representation: HortenValue,
    displays: HortenTable,
    metamorphings: HortenTable,


}

export const ports = {
    ins: [
        { name: "representation" , type: constants.REPRESENTATION, map: "representation" },
    ],
    outs: [
        {name: "display", type: constants.DISPLAY}
    ]
}

const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})

export const exhibitMetamorpherStavanger = createStavanger({
    ...nodeConductor,
    representation: createHortenValue(DEF_REPRESENTATION),
    metamorphings: createHortenTable(DEF_METAMORPHING),
    displays:  createHortenTable(DEF_DISPLAY),
})



export default connectOpera(exhibitMetamorpherStavanger)(orchestraterEpic)(NodeContainer);