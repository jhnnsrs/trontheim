import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import Opera from "./Opera";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenEdge} from "../../alta/horten/edge";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenTable} from "../../alta/horten/table";
import {DEF_DISPLAY, DEF_EXHIBIT} from "../../constants/definitions";
import {createHortenMold} from "../../alta/horten/mold";
import type {HortenMold} from "../../alta/horten/mold";


export type  ExhibitWatcherStavanger = Stavanger &{
    exhibit: HortenItem,
    exhibits: HortenTable,
    edge: HortenEdge,
    settings: HortenMold


}


export const exhibitWatcherStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.EXHIBIT, map: "exhibit"}]}),
    settings: createHortenMold({type: "settings"}),
    exhibit: createHortenItem(DEF_EXHIBIT),
    exhibits: createHortenTable(DEF_EXHIBIT),
})



export default connectOpera(exhibitWatcherStavanger)(orchestraterEpic)(Opera);