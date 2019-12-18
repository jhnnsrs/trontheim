import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_DISPLAY, DEF_ROI, DEF_SAMPLE} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type  RoiSelectorStavanger = NodeStavanger &{
    sample: HortenValue,
    display: HortenValue,
    rois: HortenTable


}
export const ports = {
    ins: [
        { name: "sample" , type: constants.SAMPLE, map: "sample" },
        { name: "display" , type: constants.DISPLAY, map: "display" },
    ],
    outs: [
        {name: "roi", type: constants.ROI}
    ]
}

const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})


export const roiSelectorStavanger = createStavanger({
    ...nodeConductor,
    sample: createHortenValue(DEF_SAMPLE),
    display: createHortenValue(DEF_DISPLAY),

    // Out
    rois: createHortenTable(DEF_ROI)
})



export default connectOpera(roiSelectorStavanger)(orchestraterEpic)(ImageMutater);