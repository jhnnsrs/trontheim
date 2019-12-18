import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {MaxISP} from "./container";
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
import {createHortenMold} from "../../alta/horten/mold";


export type  SliceLineTransformer = Stavanger &{
    samples: HortenTable,
    slice: HortenItem,
    representation: HortenItem,
    roi: HortenItem,
    transformings: HortenTable,
    transformations: HortenTable,
    edge: HortenEdge,
    settings: HortenForm


}


export const sliceLineTransformer = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [
        { in: constants.REPRESENTATION, map: "representation"},
        { in: constants.ROI, map: "roi"},
        { in: constants.SLICE, map: "slice"},
        ]}),
    settings: createHortenMold({type:"settings"}),
    slice: createHortenItem({type: constants.SLICE, url: "slices"}),
    representation: createHortenItem({type: constants.REPRESENTATION, url: "representation"}),
    roi: createHortenItem({type: constants.ROI, url: "rois"}),
    transformings: createHortenTable({type: constants.TRANSFORMING, url: "transformings"}),
    transformations:  createHortenTable({type:constants.TRANSFORMATION, url:"transformation"}),
})



export default connectOpera(sliceLineTransformer)(orchestraterEpic)(MaxISP);