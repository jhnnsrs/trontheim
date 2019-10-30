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
    DEF_BIOIMAGE,
    DEF_CREATOR,
    DEF_DISPLAY,
    DEF_EXHIBIT,
    DEF_EXPERIMENT, DEF_LOCKER,
    DEF_REPRESENTATION,
    DEF_SAMPLE, DEF_USER
} from "../../constants/definitions";
import {createHortenValue} from "../../alta/horten/value";
import type {HortenValue} from "../../alta/horten/value";


export type  SampleSelectorStavanger = Stavanger &{
    user: HortenValue,
    locker: HortenValue,
    bioimage: HortenValue,
    samples: HortenTable,
    edge: HortenEdge,
    settings: HortenForm


}


export const sampleSelectorStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [
        { in: constants.LOCKER, map: "locker"},
        { in: constants.BIOIMAGE, map: "bioimage"},
        { in: constants.EXPERIMENT, map: "experiment"},
        { in: constants.USER, map: "user"},


        ]
    }),
    settings: createHortenForm("settings"),
    user: createHortenValue(DEF_USER),
    locker: createHortenValue(DEF_LOCKER),
    bioimage: createHortenValue(DEF_BIOIMAGE),
    samples: createHortenTable(DEF_SAMPLE)
})



export default connectOpera(sampleSelectorStavanger)(orchestraterEpic)(ImageMutater);