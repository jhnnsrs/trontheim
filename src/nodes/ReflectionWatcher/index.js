import type {HortenNode} from "../../alta/horten/node";
import type {Stavanger} from "../../alta/stavanger";
import {createHortenNode} from "../../alta/horten/node";
import {createStavanger} from "../../alta/stavanger";
import {createHortenDetail} from "../../alta/horten/detail";
import {connectOpera} from "../../alta/react";
import type {HortenDetail} from "../../alta/horten/detail";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import {createHortenForm} from "../../alta/horten/form";
import type {HortenForm} from "../../alta/horten/form";
import Opera from "./Opera";
import {createHortenList} from "../../alta/horten/list";
import type {HortenList} from "../../alta/horten/list";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenEdge} from "../../alta/horten/edge";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenTable} from "../../alta/horten/table";
import {REFLECTION} from "../../constants/definitions";


export type  ReflectionWatcherStavanger = Stavanger &{
    reflection: HortenItem,
    reflections: HortenTable,
    edge: HortenEdge,
    settings: HortenForm


}


export const reflectionWatcherStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.REFLECTION, map: "reflection"}]}),
    settings: createHortenForm("settings"),
    reflection: createHortenItem(REFLECTION),
    reflections: createHortenTable(REFLECTION),
})



export default connectOpera(reflectionWatcherStavanger)(orchestraterEpic)(Opera);