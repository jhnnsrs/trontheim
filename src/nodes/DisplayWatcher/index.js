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
import {DEF_DISPLAY} from "../../constants/definitions";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";


export type  DisplayWatcherStavanger = Stavanger &{
    display: HortenItem,
    displays: HortenTable,
    edge: HortenEdge,
    settings: HortenMold


}


export const displayWatcherStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.DISPLAY, map: "display"}]}),
    settings: createHortenMold({type: "settings"}),
    display: createHortenItem(DEF_DISPLAY),
    displays: createHortenTable(DEF_DISPLAY),
})



export default connectOpera(displayWatcherStavanger)(orchestraterEpic)(Opera);