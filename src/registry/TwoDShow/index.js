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


export type  TwoDShowStavanger = NodeStavanger &{
    display: HortenValue,
    displayedDisplay: HortenItem,
    rois: HortenTable,
    canvas: HortenCanvas,


}

export const ports = {
    ins: [
        { name: "display" , type: constants.DISPLAY, map: "display" },
    ],
    outs: [
        {name: "roi", type: constants.ROI},
        {name: "bounds", type: constants.BOUNDS}
    ]
}

const nodeConductor = createNodeConductor({ports: ports, isPoppable: true})

export const twoDStavanger = createStavanger({
    ...nodeConductor,
    display: createHortenValue(DEF_DISPLAY),
    displayedDisplay: createHortenItem(DEF_DISPLAY),
    rois: createHortenTable(DEF_ROI),
    canvas: createHortenCanvas({ type: constants.CANVAS})
})



export default connectOpera(twoDStavanger)(orchestraterEpic)(TwoDShow);