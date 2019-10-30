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
    DEF_DISPLAY,
    DEF_EXHIBIT,
    DEF_EXPERIMENT,
    DEF_REPRESENTATION,
    DEF_SAMPLE,
    DEF_USER
} from "../../constants/definitions";
import {createHortenValue} from "../../alta/horten/value";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenMold} from "../../alta/horten/mold";
import type {HortenMold} from "../../alta/horten/mold";


export type  DisplaySelectorStavanger = Stavanger &{
    sample: HortenValue,
    experiment: HortenValue,
    representation: HortenValue,
    user: HortenValue,
    displays: HortenTable,
    edge: HortenEdge,
    settings: HortenMold


}


export const displaySelectorStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [
        { in: constants.SAMPLE, map: "sample"},
        { in: constants.EXPERIMENT, map: "experiment"},
        { in: constants.REPRESENTATION, map: "representation"},
        { in: constants.USER, map: "user"},

        ]}),
    settings: createHortenMold({type: "settings"}),
    sample: createHortenValue(DEF_SAMPLE),
    representation: createHortenValue(DEF_REPRESENTATION),
    experiment: createHortenValue(DEF_EXPERIMENT),
    displays:  createHortenTable(DEF_DISPLAY),
    user:  createHortenValue(DEF_USER),
})



export default connectOpera(displaySelectorStavanger)(orchestraterEpic)(ImageMutater);