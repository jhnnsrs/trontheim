import type {Stavanger} from "../../alta/stavanger";
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
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";
import {DEF_ROI} from "../../constants/definitions";
import type {RoiModel} from "../../types/models";

export type  RoiShowStavanger = Stavanger &{
    display: HortenItem,
    roi: HortenItem<RoiModel>,
    bounds: HortenTable,
    rois: HortenTable,
    canvas: HortenCanvas,
    settings: HortenMold,
    edge: HortenEdge


}


export const roiShowStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.ROI, map: "roi"}], isPoppable: true}),
    settings: createHortenMold({type: "settings"}),
    display: createHortenItem({type: constants.DISPLAY,url: "displays"}),
    roi: createHortenItem(DEF_ROI),
    bounds: createHortenTable({type: constants.BOUNDS,url: "null"}),
    rois: createHortenTable(DEF_ROI),
    canvas: createHortenCanvas({type: constants.CANVAS, disableDraw: true})
})



export default connectOpera(roiShowStavanger)(orchestraterEpic)(TwoDShow);