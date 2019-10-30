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
import {
    DEF_BIOIMAGE, DEF_DISPLAY,
    DEF_EXPERIMENT, DEF_EXPERIMENTALGROUP,
    DEF_IMPULS,
    DEF_LOCKER,
    DEF_REPRESENTATION, DEF_ROI,
    DEF_SAMPLE, DEF_USER
} from "../../constants/definitions";
import {createHortenValue} from "../../alta/horten/value";
import type {HortenValue} from "../../alta/horten/value";


export type  RoiIteratorStavanger = Stavanger &{
    // FILTERS
    sample: HortenValue,
    experiment: HortenValue,
    representation: HortenValue,
    experimentalgroup: HortenValue,
    user: HortenValue,
    display: HortenValue,

    //GETTER
    rois: HortenTable,

    //HELPERS
    impuls: HortenValue,
    sentRois: HortenTable,

    edge: HortenEdge,
    settings: HortenForm


}


export const roiIteratorStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [
            { in: constants.SAMPLE, map: "sample"},
            { in: constants.EXPERIMENT, map: "experiment"},
            { in: constants.DISPLAY, map: "display"},
            { in: constants.EXPERIMENTALGROUP, map: "experimentalgroup"},
            { in: constants.REPRESENTATION, map: "representation"},
            { in: constants.USER, map: "user"},
        ]}),
    settings: createHortenForm("settings"),
    //FILTERS
    sample: createHortenValue(DEF_SAMPLE),
    representation: createHortenValue(DEF_REPRESENTATION),
    experimentalgroup: createHortenValue(DEF_EXPERIMENTALGROUP),
    experiment: createHortenValue(DEF_EXPERIMENT),
    user:  createHortenValue(DEF_USER),
    display:  createHortenValue(DEF_DISPLAY),

    // GETTER
    rois:  createHortenTable(DEF_ROI),
    // HELPER
    sentRois:  createHortenTable(DEF_ROI),
    impuls: createHortenValue(DEF_IMPULS),
})



export default connectOpera(roiIteratorStavanger)(orchestraterEpic)(ImageMutater);