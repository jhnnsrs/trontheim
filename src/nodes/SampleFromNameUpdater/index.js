import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import ExperimentAdder from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import {
    DEF_ANIMAL,
    DEF_EXPERIMENT,
    DEF_EXPERIMENTALGROUP,
    DEF_FILEMATCHSTRING,
    DEF_SAMPLE
} from "../../constants/definitions";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";


export type  SampleFromNameUpdaterStavanger = Stavanger &{
    experiments: HortenTable,
    sample: HortenItem,
    extractedInformation: HortenItem,
    selectedFilematchstring: HortenItem,
    filematchstrings: HortenTable,
    animals: HortenTable,
    experimentalgroups: HortenTable,
    sampleout: HortenItem,
    edge: HortenEdge,
    settings: HortenMold


}


export const experimentAdderStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.SAMPLE, map: "sample"}]}),
    settings: createHortenMold({type: "settings", validator: null}),
    extractedInformation: createHortenItem({type: "information", url: "null"}),
    sample: createHortenItem(DEF_SAMPLE),
    selectedFilematchstring: createHortenItem(DEF_FILEMATCHSTRING),
    animals: createHortenTable(DEF_ANIMAL),
    experimentalgroups: createHortenTable(DEF_EXPERIMENTALGROUP),
    sampleout: createHortenItem(DEF_SAMPLE),
    experiments:  createHortenTable(DEF_EXPERIMENT),
    filematchstrings: createHortenTable(DEF_FILEMATCHSTRING),
})



export default connectOpera(experimentAdderStavanger)(orchestraterEpic)(ExperimentAdder);