import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenForm} from "../../alta/horten/form";
import {createHortenForm} from "../../alta/horten/form";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import {DEF_BIOIMAGE, DEF_IMPULS, DEF_LOCKER, DEF_SETTINGS} from "../../constants/definitions";
import {createHortenNode} from "../../alta/horten/node";
import {createHortenValue} from "../../alta/horten/value";
import {createHortenMold} from "../../alta/horten/mold";
import type {NodeStavanger} from "../lib/types";
import {createNodeConductor} from "../../conductors/createNodeConductor";


export type  LockerIterator = NodeStavanger &{
    locker: HortenItem,
    impuls: HortenItem,
    bioimages: HortenTable,
    sentBioimages: HortenTable,


}

export const ports = {
    ins: [
        { name: "locker" , type: constants.LOCKER, map: "locker"},
        { name: "impuls" , type: constants.IMPULS, map: "impuls"},
    ],
    outs: [
        {name: "bioimage", type: constants.BIOIMAGE}
    ]
}

const nodeConductor = createNodeConductor({ports: ports})

export const lockerIteratorStavanger = createStavanger({
    ...nodeConductor,
    locker: createHortenValue(DEF_LOCKER),
    impuls: createHortenValue(DEF_IMPULS),
    bioimages:  createHortenTable(DEF_BIOIMAGE),
    sentBioimages:  createHortenTable(DEF_BIOIMAGE),
})



export default connectOpera(lockerIteratorStavanger)(orchestraterEpic)(ImageMutater);