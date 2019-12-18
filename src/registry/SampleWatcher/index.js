import {createStavanger} from "../../alta/stavanger";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import Opera from "./Opera";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_SAMPLE} from "../../constants/definitions";
import type {NodeStavanger} from "../lib/types";
import {createNodeConductor} from "../../conductors/createNodeConductor";


export type  SampleWatcherStavanger = NodeStavanger &{
    sample: HortenItem,
    samples: HortenTable,


}

export const ports = {
    ins: [
        { name: "_watcher" , type: constants.SAMPLE, map: "sample"},
    ],
    outs: [
        {name: "sample", type: constants.SAMPLE}
    ]
}

const nodeConductor = createNodeConductor({ports: ports})

export const sampleWatcherStavanger = createStavanger({
    ...nodeConductor,
    sample: createHortenItem(DEF_SAMPLE),
    samples: createHortenTable(DEF_SAMPLE),
})


export default connectOpera(sampleWatcherStavanger)(orchestraterEpic)(Opera);