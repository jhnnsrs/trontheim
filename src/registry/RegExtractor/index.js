import {createStavanger} from "../../alta/stavanger";
import ExperimentAdder from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {
    DEF_ANIMAL,
    DEF_EXPERIMENT,
    DEF_EXPERIMENTALGROUP,
    DEF_FILEMATCHSTRING,
    DEF_SAMPLE
} from "../../constants/definitions";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type  NameExtractorStavanger = NodeStavanger &{
    experiments: HortenTable,
    sample: HortenItem,
    extractedInformation: HortenItem,
    selectedFilematchstring: HortenItem,
    filematchstrings: HortenTable,
    animals: HortenTable,
    experimentalgroups: HortenTable,
    sampleout: HortenItem,


}


const ports = {
    ins: [
        { name: "Sample" , type: constants.SAMPLE, map: "sample" },
        { name: "Experiment" , type: constants.EXPERIMENT, map: "experiments"},
        { name: "Creator" , type: constants.CREATOR, map: "creator"},
        { name: "BioImage" , type: constants.BIOIMAGE, map: "bioimage"},
    ],
    outs: [
        {name: "Sample", type: constants.SAMPLE}
    ]
}

const nodeConductor = createNodeConductor({ports: ports})

export const nameExtractorStavanger = createStavanger({
    ...nodeConductor,
    extractedInformation: createHortenItem({type: "information", url: "null"}),

    // FileMatchString
    filematchstrings: createHortenTable(DEF_FILEMATCHSTRING),
    selectedFilematchstring: createHortenItem(DEF_FILEMATCHSTRING),


    // Extractable Groups
    animals: createHortenTable(DEF_ANIMAL),
    experimentalgroups: createHortenTable(DEF_EXPERIMENTALGROUP),
    experiments:  createHortenTable(DEF_EXPERIMENT),

    // Ins and Outs
    sample: createHortenItem(DEF_SAMPLE),
    sampleout: createHortenItem(DEF_SAMPLE),
})



export default connectOpera(nameExtractorStavanger)(orchestraterEpic)(ExperimentAdder);