import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenForm} from "../../alta/horten/form";
import {createHortenForm} from "../../alta/horten/form";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import {DEF_BIOIMAGE, DEF_DISPLAY, DEF_LOCKER, DEF_SAMPLE, DEF_USER} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createHortenNode} from "../../alta/horten/node";
import {createHortenMold} from "../../alta/horten/mold";
import type {HortenNode} from "../../alta/horten/node";
import type {HortenMold} from "../../alta/horten/mold";


export type  DisplaySelectorStavanger = Stavanger &{
    sample: HortenValue,
    node: HortenNode,
    settings: HortenMold,
    displays: HortenTable


}
export const ports = {
    ins: [
        { name: "sample" , type: constants.SAMPLE, map: "sample" },
    ],
    outs: [
        {name: "display", type: constants.DISPLAY}
    ]
}



export const displaySelectorStavanger = createStavanger({
    node: createHortenNode({type: constants.NODE, ports: ports}),
    settings: createHortenMold({type: "settings"}),
    sample: createHortenValue(DEF_SAMPLE),

    // Out
    displays: createHortenTable(DEF_DISPLAY)
})



export default connectOpera(displaySelectorStavanger)(orchestraterEpic)(ImageMutater);