import {createStavanger} from "../../alta/stavanger";
import {TwoDShow} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenCanvas} from "../../alta/horten/canvas";
import {createHortenCanvas} from "../../alta/horten/canvas";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {DEF_DISPLAY, DEF_ROI} from "../../constants/definitions";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type  RoiShowerStavanger = NodeStavanger &{
    display: HortenValue,
    roi: HortenValue,
    displayedDisplay: HortenItem,
    rois: HortenTable,
    canvas: HortenCanvas,

}

export const ports = {
    ins: [
        { name: "display" , type: constants.DISPLAY, map: "display" },
        { name: "roi" , type: constants.ROI, map: "roi" },
    ],
    outs: [
        {name: "roi", type: constants.ROI},
        {name: "bounds", type: constants.BOUNDS}
    ]
}

const nodeConductor = createNodeConductor({ports: ports, isPoppable: true})

export const roiShowerStavanger = createStavanger({
    ...nodeConductor,
    display: createHortenValue(DEF_DISPLAY),
    displayedDisplay: createHortenItem(DEF_DISPLAY),
    roi: createHortenItem(DEF_ROI),
    rois: createHortenTable(DEF_ROI),
    canvas: createHortenCanvas({ type: constants.CANVAS})
})



export default connectOpera(roiShowerStavanger)(orchestraterEpic)(TwoDShow);