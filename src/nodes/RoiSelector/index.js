import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenForm} from "../../alta/horten/form";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import {DEF_ROI, DEF_SAMPLE} from "../../constants/definitions";
import {createHortenMold} from "../../alta/horten/mold";


export type  RoiSelectorStavanger = Stavanger &{
    sample: HortenItem,
    roi: HortenItem,
    rois: HortenTable,
    edge: HortenEdge,
    settings: HortenForm


}


export const roiSelectorStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.SAMPLE, map: "sample"}], isPoppable: true}),
    settings: createHortenMold({type:"settings"}),
    sample: createHortenItem(DEF_SAMPLE),
    rois:  createHortenTable(DEF_ROI),
})



export default connectOpera(roiSelectorStavanger)(orchestraterEpic)(ImageMutater);