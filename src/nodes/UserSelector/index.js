import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenForm} from "../../alta/horten/form";
import {createHortenForm} from "../../alta/horten/form";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import {DEF_USER} from "../../constants/definitions";


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