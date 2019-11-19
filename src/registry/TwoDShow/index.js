import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {TwoDShow} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenCanvas} from "../../alta/horten/canvas";
import {createHortenCanvas} from "../../alta/horten/canvas";
import type {HortenForm} from "../../alta/horten/form";
import {createHortenForm} from "../../alta/horten/form";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import {createHortenNode} from "../../alta/horten/node";
import {createHortenValue} from "../../alta/horten/value";
import {DEF_DISPLAY, DEF_ROI} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import type {HortenNode} from "../../alta/horten/node";
import {createHortenMold} from "../../alta/horten/mold";


export type  TwoDShowStavanger = Stavanger &{
    display: HortenValue,
    displayedDisplay: HortenItem,
    rois: HortenTable,
    canvas: HortenCanvas,
    settings: HortenForm,
    node: HortenNode


}

export const ports = {
    ins: [
        { name: "Display" , type: constants.DISPLAY, map: "display" },
    ],
    outs: [
        {name: "Roi", type: constants.ROI},
        {name: "Bounds", type: constants.BOUNDS}
    ]
}


export const twoDStavanger = createStavanger({
    node: createHortenNode({type: constants.NODE, ports: ports, isPoppable: true, isAlienable: true}),
    settings: createHortenMold({type: "settings"}),
    display: createHortenValue(DEF_DISPLAY),
    displayedDisplay: createHortenItem(DEF_DISPLAY),
    rois: createHortenTable(DEF_ROI),
    canvas: createHortenCanvas({ type: constants.CANVAS})
})



export default connectOpera(twoDStavanger)(orchestraterEpic)(TwoDShow);