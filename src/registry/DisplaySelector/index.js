import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_DISPLAY, DEF_SAMPLE} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type  DisplaySelectorStavanger = NodeStavanger &{
    sample: HortenValue,
    displays: HortenTable


}
export const ports = {
    ins: [
        { name: "sample" , type: constants.SAMPLE, map: "sample" },
    ],
    outs: [
        {name: "display", type: constants.DISPLAY}
    ]
}

const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})


export const displaySelectorStavanger = createStavanger({
    ...nodeConductor,
    sample: createHortenValue(DEF_SAMPLE),

    // Out
    displays: createHortenTable(DEF_DISPLAY)
})



export default connectOpera(displaySelectorStavanger)(orchestraterEpic)(ImageMutater);