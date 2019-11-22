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
import {createHortenMold} from "../../alta/horten/mold";
import type {NodeStavanger} from "../lib/types";
import {createHortenNode} from "../../alta/horten/node";
import {DEF_CUBE, DEF_EXHIBIT, DEF_ROI, DEF_SETTINGS} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";


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
        {name: "exhibit", type: constants.EXHIBIT}
    ]
}



export const exhibitShowStavanger = createStavanger({
    node: createHortenNode({type: constants.NODE, ports: ports, isPoppable: true}),
    settings: createHortenMold(DEF_SETTINGS),
    exhibitin: createHortenValue(DEF_EXHIBIT),
    exhibit: createHortenItem(DEF_EXHIBIT),
    rois: createHortenTable(DEF_ROI),
    cube: createHortenCube(DEF_CUBE)
})




export default connectOpera(exhibitShowStavanger)(orchestraterEpic)(TwoDShow);