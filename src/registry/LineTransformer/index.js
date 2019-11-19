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
import type {HortenMold} from "../../alta/horten/mold";
import type {HortenNode} from "../../alta/horten/node";
import {createHortenNode} from "../../alta/horten/node";


export type LineTransformer = Stavanger &{
    samples: HortenTable,
    representation: HortenItem,
    roi: HortenItem,
    transformings: HortenTable,
    transformations: HortenTable,
    node: HortenNode,
    settings: HortenMold


}

export const ports = {
    ins: [
        { name: "Roi" , type: constants.ROI, map: "roi" },
        { name: "Representation" , type: constants.REPRESENTATION, map: "representation" },
    ],
    outs: [
        {name: "Transformation", type: constants.TRANSFORMATION}
    ]
}


export const lineTransformerStavanger = createStavanger({
    node: createHortenNode({type: constants.NODE, ports: ports}),
    settings: createHortenMold({type:"settings"}),
    representation: createHortenItem({type: constants.REPRESENTATION, url: "representation"}),
    roi: createHortenItem({type: constants.ROI, url: "rois"}),
    transformings: createHortenTable({type: constants.TRANSFORMING, url: "transformings"}),
    transformations:  createHortenTable({type:constants.TRANSFORMATION, url:"transformation"}),
})



export default connectOpera(lineTransformerStavanger)(orchestraterEpic)(MaxISP);