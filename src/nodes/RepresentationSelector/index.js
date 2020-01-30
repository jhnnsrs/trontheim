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
import {DEF_REPRESENTATION, DEF_SAMPLE} from "../../constants/definitions";


export type  RepresentationSelectorStavanger = Stavanger &{
    sample: HortenItem,
    representations: HortenTable,
    edge: HortenEdge,
    settings: HortenForm


}


export const representationSelectorStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.SAMPLE, map: "sample"}]}),
    settings: createHortenForm("settings"),
    sample: createHortenItem(DEF_SAMPLE),
    representations:  createHortenTable(DEF_REPRESENTATION),
})



export default connectOpera(representationSelectorStavanger)(orchestraterEpic)(ImageMutater);