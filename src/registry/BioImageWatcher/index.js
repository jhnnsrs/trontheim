import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import Opera from "./Opera";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_BIOIMAGE, DEF_LOCKER, DEF_SETTINGS} from "../../constants/definitions";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";
import {createHortenNode} from "../../alta/horten/node";
import type {HortenNode} from "../../alta/horten/node";
import type {NodeStavanger} from "../lib/types";


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


export const bioImageWatcherStavanger = createStavanger({
    node: createHortenNode({type: constants.NODE, ports: ports}),
    settings: createHortenMold(DEF_SETTINGS),
    bioimage: createHortenItem(DEF_BIOIMAGE),
    bioimages: createHortenTable(DEF_BIOIMAGE),
})



export default connectOpera(bioImageWatcherStavanger)(orchestraterEpic)(Opera);