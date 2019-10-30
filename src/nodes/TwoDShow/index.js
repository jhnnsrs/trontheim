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


export type  TwoDShowStavanger = Stavanger &{
    display: HortenItem,
    displayedDisplay: HortenItem,
    rois: HortenTable,
    canvas: HortenCanvas,
    settings: HortenForm,
    edge: HortenEdge


}


export const twoDStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.DISPLAY, map: "display"}], isPoppable: true, isAlienable: true}),
    settings: createHortenForm("settings"),
    display: createHortenItem({type: constants.DISPLAY,url: "displays"}),
    displayedDisplay: createHortenItem({type: constants.DISPLAY,url: "displays"}),
    rois: createHortenTable({type: constants.ROI,url:"rois"}),
    canvas: createHortenCanvas({ type: constants.CANVAS})
})



export default connectOpera(twoDStavanger)(orchestraterEpic)(TwoDShow);