import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {
    DEF_BIOIMAGE,
    DEF_LOCKER,
    DEF_REPRESENTATION,
    DEF_ZARR_CHANNEL,
    DEF_ZARR_CHANNELS
} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import {createNodeConductor} from "../../conductors/createNodeConductor";
import type {NodeStavanger} from "../lib/types";


export type  ChannelMapper = NodeStavanger &{
    representation: HortenValue,
    channels: HortenTable


}
export const ports = {
    ins: [
        { name: "representation" , type: constants.REPRESENTATION, map: "representation" },
    ],
    outs: [
        {name: "channelmap", type: constants.CHANNELMAP}
    ]
}


const nodeConductor = createNodeConductor({ports: ports, isPoppable: false})

export const channelMapperStavanger = createStavanger({
    ...nodeConductor,
    representation: createHortenValue(DEF_REPRESENTATION),

    // Out
    channels: createHortenTable(DEF_ZARR_CHANNEL)
})



export default connectOpera(channelMapperStavanger)(orchestraterEpic)(ImageMutater);