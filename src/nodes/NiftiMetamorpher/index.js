import type {HortenNode} from "../../alta/horten/node";
import type {Stavanger} from "../../alta/stavanger";
import {createHortenNode} from "../../alta/horten/node";
import {createStavanger} from "../../alta/stavanger";
import {createHortenDetail} from "../../alta/horten/detail";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import type {HortenDetail} from "../../alta/horten/detail";
import {orchestraterEpic} from "./orchestrater";
import type {HortenList} from "../../alta/horten/list";
import {createHortenList} from "../../alta/horten/list";
import * as constants from "../../constants"
import {createHortenForm} from "../../alta/horten/form";
import type {HortenForm} from "../../alta/horten/form";
import {createHortenItem} from "../../alta/horten/item";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenTable} from "../../alta/horten/table";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenEdge} from "../../alta/horten/edge";
import type {HortenEdge} from "../../alta/horten/edge";


export type  BioConverterStavanger = Stavanger &{
    metamorphings: HortenTable,
    representation: HortenItem,
    exhibits: HortenTable,
    edge: HortenEdge,
    settings: HortenForm


}


export const bioConverterStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.REPRESENTATION, map: "representation"}]}),
    settings: createHortenForm("settings"),
    representation: createHortenItem({type: constants.REPRESENTATION, url: "representations"}),
    metamorphings: createHortenTable({type: constants.METAMORPHING,url: "metamorphings"}),
    exhibits:  createHortenTable({type: constants.EXHIBIT,url: "exhibits"}),
})



export default connectOpera(bioConverterStavanger)(orchestraterEpic)(ImageMutater);