import type {HortenNode} from "../../alta/horten/node";
import type {Stavanger} from "../../alta/stavanger";
import {createHortenNode} from "../../alta/horten/node";
import {createStavanger} from "../../alta/stavanger";
import {createHortenDetail} from "../../alta/horten/detail";
import {MaxISP} from "./container";
import {connectOpera} from "../../alta/react";
import type {HortenDetail} from "../../alta/horten/detail";
import {orchestraterEpic} from "./orchestrater";
import type {HortenList} from "../../alta/horten/list";
import {createHortenList} from "../../alta/horten/list";
import * as constants from "../../constants"
import {createHortenCanvas} from "../../alta/horten/canvas";
import type {HortenCanvas} from "../../alta/horten/canvas";
import {createHortenForm} from "../../alta/horten/form";
import type {HortenForm} from "../../alta/horten/form";
import {createHortenItem} from "../../alta/horten/item";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenEdge} from "../../alta/horten/edge";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenMold} from "../../alta/horten/mold";
import {DEF_TRANSFORMATION} from "../../constants/definitions";
import type {HortenMold} from "../../alta/horten/mold";


export type  AISEvaluatorStavanger = Stavanger &{
    transformation: HortenItem,
    roi: HortenItem,
    evaluating: HortenTable,
    volumedatas: HortenTable,
    edge: HortenEdge,
    settings: HortenMold


}


export const aisEvaluatorStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [
        { in: constants.TRANSFORMATION, map: "transformation"},
        ]}),
    settings: createHortenMold({type:"settings"}),
    transformation: createHortenItem(DEF_TRANSFORMATION),
    roi: createHortenItem({type: constants.ROI, url: "rois"}),
    evaluating: createHortenTable({type: constants.EVALUATING, url: "evaluating"}),
    volumedatas:  createHortenTable({type:constants.VOLUMEDATA, url:"volumedata"}),
})



export default connectOpera(aisEvaluatorStavanger)(orchestraterEpic)(MaxISP);