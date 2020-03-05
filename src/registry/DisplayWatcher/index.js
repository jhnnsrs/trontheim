import {createStavanger} from "../../alta/stavanger";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import Opera from "./Opera";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_DISPLAY, DEF_LOCKER} from "../../constants/definitions";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type  DisplayWatcherStavanger = NodeStavanger &{
    display: HortenItem,
    displays: HortenTable,


}

export const ports = {
    ins: [
        { name: "_watcher" , type: constants.DISPLAY, map: "display"},
    ],
    outs: [
        {name: "display", type: constants.DISPLAY}
    ]
}
const nodeConductor = createNodeConductor({ports: ports})

export const lockerWatcherStavanger = createStavanger({
    ...nodeConductor,
    display: createHortenItem(DEF_DISPLAY),
    displays: createHortenTable(DEF_DISPLAY),
})



export default connectOpera(lockerWatcherStavanger)(orchestraterEpic)(Opera);