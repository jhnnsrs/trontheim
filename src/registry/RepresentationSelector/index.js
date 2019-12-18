import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_REPRESENTATION, DEF_SAMPLE} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type  RepresentationSelector = NodeStavanger &{
    sample: HortenValue,
    representations: HortenTable


}
export const ports = {
    ins: [
        { name: "sample" , type: constants.SAMPLE, map: "sample" },
    ],
    outs: [
        {name: "representation", type: constants.REPRESENTATION}
    ]
}

const nodeConductor = createNodeConductor({ports: ports})

export const representationSelectorStavanger = createStavanger({
    ...nodeConductor,
    sample: createHortenValue(DEF_SAMPLE),

    // Out
    representations: createHortenTable(DEF_REPRESENTATION)
})



export default connectOpera(representationSelectorStavanger)(orchestraterEpic)(ImageMutater);