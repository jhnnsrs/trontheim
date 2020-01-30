import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_BIOIMAGE, DEF_BIOSERIES, DEF_LOCKER} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type  BioSeriesFilter = NodeStavanger &{
    bioseriesin: HortenValue,
    bioseries: HortenTable


}
export const ports = {
    ins: [
        { name: "bioseries" , type: constants.BIOSERIES, map: "bioseriesin" },
    ],
    outs: [
        {name: "bioseries", type: constants.BIOSERIES}
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})

export const bioSeriesFilterStavanger = createStavanger({
    ...nodeConductor,
    bioseriesin: createHortenValue(DEF_BIOSERIES),

    // Out
    bioseries: createHortenTable(DEF_BIOSERIES)
})



export default connectOpera(bioSeriesFilterStavanger)(orchestraterEpic)(ImageMutater);