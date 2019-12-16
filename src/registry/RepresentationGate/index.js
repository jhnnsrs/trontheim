import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_BIOIMAGE, DEF_IMPULS, DEF_LOCKER, DEF_REPRESENTATION} from "../../constants/definitions";
import {createHortenValue} from "../../alta/horten/value";
import type {NodeStavanger} from "../lib/types";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {HortenValue} from "../../alta/horten/value";


export type  RepresentationGate = NodeStavanger &{
    representation: HortenValue,
    impuls: HortenItem,
    representations: HortenTable,

}

export const ports = {
    ins: [
        { name: "representation" , type: constants.REPRESENTATION, map: "representation"},
        { name: "impuls" , type: constants.STAR, map: "impuls"},
    ],
    outs: [
        {name: "representation", type: constants.REPRESENTATION}
    ]
}

const nodeConductor = createNodeConductor({ports: ports})

export const representationGateStavanger = createStavanger({
    ...nodeConductor,
    representation: createHortenValue(DEF_REPRESENTATION),
    impuls: createHortenValue(DEF_IMPULS),
    representations:  createHortenTable(DEF_REPRESENTATION),
})



export default connectOpera(representationGateStavanger)(orchestraterEpic)(ImageMutater);