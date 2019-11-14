import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import ExperimentAdder from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import {DEF_ANIMAL, DEF_EXPERIMENT, DEF_EXPERIMENTALGROUP, DEF_SAMPLE} from "../../constants/definitions";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";


export type  SampleUpdaterStavanger = Stavanger &{
    sample: HortenItem,
    experiment: HortenValue,
    animal: HortenValue,
    experimentalgroup: HortenValue,
    sampleout: HortenItem,
    edge: HortenEdge,
    settings: HortenMold


}


export const sampleUpdaterStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [
        { in: constants.SAMPLE, map: "sample"},
        { in: constants.EXPERIMENT, map: "experiment"},
        { in: constants.ANIMAL, map: "animal"},
        { in: constants.EXPERIMENTALGROUP, map: "experimentalgroup"},
        ]}),
    settings: createHortenMold({type: "settings", validator: null}),
    sample: createHortenItem(DEF_SAMPLE),
    sampleout: createHortenItem(DEF_SAMPLE),
    experimentalgroup: createHortenValue(DEF_EXPERIMENTALGROUP),
    experiment: createHortenValue(DEF_EXPERIMENT),
    animal: createHortenValue(DEF_ANIMAL)
})



export default connectOpera(sampleUpdaterStavanger)(orchestraterEpic)(ExperimentAdder);