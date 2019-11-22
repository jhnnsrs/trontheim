import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_BIOIMAGE, DEF_LOCKER} from "../../constants/definitions";
import type {HortenValue} from "../../alta/horten/value";
import {createHortenValue} from "../../alta/horten/value";
import type {HortenNode} from "../../alta/horten/node";
import {createHortenNode} from "../../alta/horten/node";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";


export type  BioImageSelector = Stavanger &{
    locker: HortenValue,
    node: HortenNode,
    settings: HortenMold,
    bioimages: HortenTable


}
export const ports = {
    ins: [
        { name: "locker" , type: constants.LOCKER, map: "locker" },
    ],
    outs: [
        {name: "bioimage", type: constants.BIOIMAGE}
    ]
}



export const bioImageSelectorStavanger = createStavanger({
    node: createHortenNode({type: constants.NODE, ports: ports}),
    settings: createHortenMold({type: "settings"}),
    locker: createHortenValue(DEF_LOCKER),

    // Out
    bioimages: createHortenTable(DEF_BIOIMAGE)
})



export default connectOpera(bioImageSelectorStavanger)(orchestraterEpic)(ImageMutater);