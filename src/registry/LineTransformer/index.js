import {createStavanger} from "../../alta/stavanger";
import {MaxISP} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type LineTransformer = NodeStavanger &{
    samples: HortenTable,
    representation: HortenItem,
    roi: HortenItem,
    transformings: HortenTable,
    transformations: HortenTable,


}

export const ports = {
    ins: [
        { name: "roi" , type: constants.ROI, map: "roi" },
        { name: "representation" , type: constants.REPRESENTATION, map: "representation" },
    ],
    outs: [
        {name: "transformation", type: constants.TRANSFORMATION}
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})


export const lineTransformerStavanger = createStavanger({
    ...nodeConductor,
    representation: createHortenItem({type: constants.REPRESENTATION, url: "representation"}),
    roi: createHortenItem({type: constants.ROI, url: "rois"}),
    transformings: createHortenTable({type: constants.TRANSFORMING, url: "transformings"}),
    transformations:  createHortenTable({type:constants.TRANSFORMATION, url:"transformation"}),
})



export default connectOpera(lineTransformerStavanger)(orchestraterEpic)(MaxISP);