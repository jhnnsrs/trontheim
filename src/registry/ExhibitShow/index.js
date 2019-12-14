import {createStavanger} from "../../alta/stavanger";
import {TwoDShow} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenCube} from "../../alta/horten/cube";
import {createHortenCube} from "../../alta/horten/cube";
import type {NodeStavanger} from "../lib/types";
import {DEF_CUBE, DEF_EXHIBIT, DEF_ROI} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createNodeConductor} from "../../conductors/createNodeConductor";


export type  ExhibitShowStavanger = NodeStavanger &{
    exhibitin: HortenValue,
    exhibit: HortenItem,
    rois: HortenTable,
    cube: HortenCube,

}

export const ports = {
    ins: [
        { name: "exhibit" , type: constants.EXHIBIT, map: "exhibitin" },
    ],
    outs: [
        {name: "slice", type: constants.SLICE}
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: true})

export const exhibitShowStavanger = createStavanger({
    ...nodeConductor,
    exhibitin: createHortenValue(DEF_EXHIBIT),
    exhibit: createHortenItem(DEF_EXHIBIT),
    rois: createHortenTable(DEF_ROI),
    cube: createHortenCube(DEF_CUBE)
})




export default connectOpera(exhibitShowStavanger)(orchestraterEpic)(TwoDShow);