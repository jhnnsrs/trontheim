import {createStavanger} from "../../alta/stavanger";
import {NodeContainer} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_FILTERING, DEF_REPRESENTATION} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import type {NodeStavanger} from "../lib/types";
import {createNodeConductor} from "../../conductors/createNodeConductor";


export type MaxISP = NodeStavanger &{
    representation: HortenValue,
    representations: HortenTable,
    filterings: HortenTable,


}

export const ports = {
    ins: [
        { name: "representation" , type: constants.REPRESENTATION, map: "representation" },
    ],
    outs: [
        {name: "representation", type: constants.REPRESENTATION}
    ]
}

const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})

export const maxISPStavanger = createStavanger({
    ...nodeConductor,
    representation: createHortenValue(DEF_REPRESENTATION),
    filterings: createHortenTable(DEF_FILTERING),
    representations:  createHortenTable(DEF_REPRESENTATION),
})



export default connectOpera(maxISPStavanger)(orchestraterEpic)(NodeContainer);