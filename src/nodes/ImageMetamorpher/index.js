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


export type  BioConverterStavanger = Stavanger &{
    metamorphings: HortenTable,
    representation: HortenItem,
    displays: HortenTable,
    edge: HortenEdge,
    settings: HortenForm


}


export const bioConverterStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.REPRESENTATION, map: "representation"}]}),
    settings: createHortenForm("settings"),
    representation: createHortenItem({type: constants.REPRESENTATION, url: "representations"}),
    metamorphings: createHortenTable({type: constants.METAMORPHING,url: "metamorphings"}),
    displays:  createHortenTable({type: constants.DISPLAY,url: "displays"}),
})



export default connectOpera(bioConverterStavanger)(orchestraterEpic)(ImageMutater);