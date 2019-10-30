import type {HortenNode} from "../../alta/horten/node";
import type {Stavanger} from "../../alta/stavanger";
import {createHortenNode} from "../../alta/horten/node";
import {createStavanger} from "../../alta/stavanger";
import {createHortenDetail} from "../../alta/horten/detail";
import {MaxISP} from "./container";
import {connectOpera} from "../../alta/react";
import type {HortenDetail} from "../../alta/horten/detail";
import {orchestraterEpic} from "./orchestrater";
import type {HortenList} from "../../alta/horten/list";
import {createHortenList} from "../../alta/horten/list";
import * as constants from "../../constants"
import {createHortenCanvas} from "../../alta/horten/canvas";
import type {HortenCanvas} from "../../alta/horten/canvas";
import {createHortenForm} from "../../alta/horten/form";
import type {HortenForm} from "../../alta/horten/form";
import {createHortenItem} from "../../alta/horten/item";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenEdge} from "../../alta/horten/edge";
import type {HortenEdge} from "../../alta/horten/edge";


export type  SlicedMaxISPStavanger = Stavanger &{
    representations: HortenTable,
    representation: HortenItem,
    filterings: HortenTable,
    edge: HortenEdge,
    settings: HortenForm,
    slice: HortenItem,


}


export const slicedMaxISPStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [
            { in: constants.REPRESENTATION, map: "representation"},
            { in: constants.SLICE, map: "slice" }]}),
    settings: createHortenForm("settings"),
    representation: createHortenItem({type: constants.REPRESENTATION, url: "representations"}),
    slice: createHortenItem({type: constants.SLICE, url: "slices"}),
    filterings: createHortenTable({type: constants.FILTERING, url: "filterings"}),
    representations:  createHortenTable({type:constants.REPRESENTATION, url:"representations"}),
})



export default connectOpera(slicedMaxISPStavanger)(orchestraterEpic)(MaxISP);