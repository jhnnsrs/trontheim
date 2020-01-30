import {createStavanger} from "../../alta/stavanger";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import Opera from "./Opera";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_BIOIMAGE, DEF_REPRESENTATION} from "../../constants/definitions";
import type {NodeStavanger} from "../lib/types";
import {createNodeConductor} from "../../conductors/createNodeConductor";


export type  BioImageWatcher = NodeStavanger &{
    representation: HortenItem,
    representations: HortenTable,


}

export const ports = {
    ins: [
        { name: "_watcher" , type: constants.REPRESENTATION, map: "representation"},
    ],
    outs: [
        {name: "representation", type: constants.REPRESENTATION}
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})


export const bioImageWatcherStavanger = createStavanger({
    ...nodeConductor,
    representation: createHortenItem(DEF_REPRESENTATION),
    representations: createHortenTable(DEF_REPRESENTATION),
})



export default connectOpera(bioImageWatcherStavanger)(orchestraterEpic)(Opera);