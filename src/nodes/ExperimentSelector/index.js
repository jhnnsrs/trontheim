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
import {DEF_EXPERIMENT, DEF_USER} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";


export type  ExperimentSelectorStavanger = Stavanger &{
    creator: HortenValue,
    experiments: HortenTable,
    edge: HortenEdge,
    settings: HortenForm


}


export const experimentSelectorStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [
        { in: constants.USER, map: "creator"}]}),
    settings: createHortenForm("settings"),
    creator: createHortenValue(DEF_USER),
    experiments:  createHortenTable(DEF_EXPERIMENT),
})



export default connectOpera(experimentSelectorStavanger)(orchestraterEpic)(ImageMutater);