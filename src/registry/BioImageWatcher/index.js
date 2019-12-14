import {createStavanger} from "../../alta/stavanger";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import Opera from "./Opera";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_BIOIMAGE} from "../../constants/definitions";
import type {NodeStavanger} from "../lib/types";
import {createNodeConductor} from "../../conductors/createNodeConductor";


export type  BioImageWatcher = NodeStavanger &{
    bioimage: HortenItem,
    bioimages: HortenTable,


}

export const ports = {
    ins: [
        { name: "_watcher" , type: constants.BIOIMAGE, map: "bioimage"},
    ],
    outs: [
        {name: "bioimage", type: constants.BIOIMAGE}
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})


export const bioImageWatcherStavanger = createStavanger({
    ...nodeConductor,
    bioimage: createHortenItem(DEF_BIOIMAGE),
    bioimages: createHortenTable(DEF_BIOIMAGE),
})



export default connectOpera(bioImageWatcherStavanger)(orchestraterEpic)(Opera);