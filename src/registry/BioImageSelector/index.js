import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_BIOIMAGE, DEF_LOCKER} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type  BioImageSelector = NodeStavanger &{
    locker: HortenValue,
    bioimages: HortenTable


}
export const ports = {
    ins: [
        { name: "locker" , type: constants.LOCKER, map: "locker" },
    ],
    outs: [
        {name: "bioimage", type: constants.BIOIMAGE}
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})

export const bioImageSelectorStavanger = createStavanger({
    ...nodeConductor,
    locker: createHortenValue(DEF_LOCKER),

    // Out
    bioimages: createHortenTable(DEF_BIOIMAGE)
})



export default connectOpera(bioImageSelectorStavanger)(orchestraterEpic)(ImageMutater);