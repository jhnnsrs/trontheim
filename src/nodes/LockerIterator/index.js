import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenForm} from "../../alta/horten/form";
import {createHortenForm} from "../../alta/horten/form";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import {DEF_BIOIMAGE, DEF_IMPULS, DEF_LOCKER} from "../../constants/definitions";


export type  ExhibitSelectorStavanger = Stavanger &{
    locker: HortenItem,
    impuls: HortenItem,
    bioimages: HortenTable,
    sentBioimages: HortenTable,
    edge: HortenEdge,
    settings: HortenForm


}


export const exhibitSelectorStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [
        { in: constants.LOCKER, map: "locker"},
        { in: constants.IMPULS, map: "impuls"},
        ]}),
    settings: createHortenForm("settings"),
    locker: createHortenItem(DEF_LOCKER),
    impuls: createHortenItem(DEF_IMPULS),
    bioimages:  createHortenTable(DEF_BIOIMAGE),
    sentBioimages:  createHortenTable(DEF_BIOIMAGE),
})



export default connectOpera(exhibitSelectorStavanger)(orchestraterEpic)(ImageMutater);