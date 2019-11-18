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
import {DEF_LOCKER} from "../../constants/definitions";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";
import {createHortenNode} from "../../alta/horten/node";
import type {HortenNode} from "../../alta/horten/node";


export type  LockerWatcherStavanger = Stavanger &{
    locker: HortenItem,
    lockers: HortenTable,
    node: HortenNode,
    settings: HortenMold


}

export const ports = {
    ins: [
        { name: "_watcher" , type: constants.LOCKER, map: "locker" },
    ],
    outs: [
        {name: "Locker", type: constants.LOCKER}
    ]
}


export const lockerWatcherStavanger = createStavanger({
    node: createHortenNode({type: constants.NODE, ports: ports}),
    settings: createHortenMold({type: "settings"}),
    locker: createHortenItem(DEF_LOCKER),
    lockers: createHortenTable(DEF_LOCKER),
})



export default connectOpera(lockerWatcherStavanger)(orchestraterEpic)(Opera);