import {createStavanger} from "../../alta/stavanger";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import Opera from "./Opera";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_BIOSERIES} from "../../constants/definitions";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type  BioSeriesCollectorStavanger = NodeStavanger &{
    bioseries: HortenItem,
    bioserieslist: HortenTable,

}

export const ports = {
    ins: [
        { name: "bioseries" , type: constants.BIOSERIES, map: "bioseries" },
    ],
    outs: [
        {name: "bioseries", type: constants.BIOSERIES}
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})

export const bioSeriesCollectorStavanger = createStavanger({
    ...nodeConductor,
    bioseries: createHortenItem(DEF_BIOSERIES),
    bioserieslist: createHortenTable(DEF_BIOSERIES),
})



export default connectOpera(bioSeriesCollectorStavanger)(orchestraterEpic)(Opera);