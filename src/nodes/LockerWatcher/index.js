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


export type  LockerWatcherStavanger = Stavanger &{
    locker: HortenItem,
    lockers: HortenTable,
    edge: HortenEdge,
    settings: HortenMold


}


export const lockerWatcherStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.LOCKER, map: "locker"}]}),
    settings: createHortenMold({type: "settings"}),
    locker: createHortenItem(DEF_LOCKER),
    lockers: createHortenTable(DEF_LOCKER),
})



export default connectOpera(lockerWatcherStavanger)(orchestraterEpic)(Opera);