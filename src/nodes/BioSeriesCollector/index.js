import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenForm} from "../../alta/horten/form";
import {createHortenForm} from "../../alta/horten/form";
import Opera from "./Opera";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";


export type  BioSeriesCollectorStavanger = Stavanger &{
    bioseries: HortenItem,
    bioserieslist: HortenTable,
    edge: HortenEdge,
    settings: HortenForm


}


export const bioSeriesCollectorStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.BIOSERIES, map: "bioseries"}]}),
    settings: createHortenForm("settings"),
    bioseries: createHortenItem({type: constants.BIOSERIES, url: "bioseries"}),
    bioserieslist: createHortenTable({type: constants.BIOSERIES, url: "bioseries"}),
})



export default connectOpera(bioSeriesCollectorStavanger)(orchestraterEpic)(Opera);