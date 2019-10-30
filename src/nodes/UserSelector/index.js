import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import {createHortenForm} from "../../alta/horten/form";
import type {HortenForm} from "../../alta/horten/form";
import {createHortenItem} from "../../alta/horten/item";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenTable} from "../../alta/horten/table";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenEdge} from "../../alta/horten/edge";
import type {HortenEdge} from "../../alta/horten/edge";
import {
    DEF_CREATOR,
    DEF_DISPLAY,
    DEF_EXHIBIT,
    DEF_EXPERIMENT,
    DEF_REPRESENTATION,
    DEF_SAMPLE, DEF_USER
} from "../../constants/definitions";
import {createHortenValue} from "../../alta/horten/value";
import type {HortenValue} from "../../alta/horten/value";


export type  UserSelectorStavanger = Stavanger &{
    creators: HortenTable,
    edge: HortenEdge,
    settings: HortenForm


}


export const userSelectorStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: []}),
    settings: createHortenForm("settings"),
    creators:  createHortenTable(DEF_USER),
})



export default connectOpera(userSelectorStavanger)(orchestraterEpic)(ImageMutater);