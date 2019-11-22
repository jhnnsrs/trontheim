import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {NodeContainer} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenForm} from "../../alta/horten/form";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import {createHortenMold} from "../../alta/horten/mold";
import type {HortenMold} from "../../alta/horten/mold";
import type {HortenNode} from "../../alta/horten/node";
import {createHortenNode} from "../../alta/horten/node";
import {
    DEF_ANALYZING,
    DEF_BIOIMAGE,
    DEF_BIOSERIES, DEF_CONVERSING, DEF_EXHIBIT, DEF_FILTERING, DEF_METAMORPHING,
    DEF_REPRESENTATION,
    DEF_SAMPLE,
    DEF_SETTINGS
} from "../../constants/definitions";
import {createHortenValue} from "../../alta/horten/value";
import type {HortenValue} from "../../alta/horten/value";
import type {NodeStavanger} from "../lib/types";


export type ExhibitMetamorpher = NodeStavanger &{
    representation: HortenValue,
    exhibits: HortenTable,
    metamorphings: HortenTable,


}

export const ports = {
    ins: [
        { name: "representation" , type: constants.REPRESENTATION, map: "representation" },
    ],
    outs: [
        {name: "exhibit", type: constants.EXHIBIT}
    ]
}


export const exhibitMetamorpherStavanger = createStavanger({
    node: createHortenNode({type: constants.NODE, ports: ports}),
    settings: createHortenMold(DEF_SETTINGS),
    representation: createHortenValue(DEF_REPRESENTATION),
    metamorphings: createHortenTable(DEF_METAMORPHING),
    exhibits:  createHortenTable(DEF_EXHIBIT),
})



export default connectOpera(exhibitMetamorpherStavanger)(orchestraterEpic)(NodeContainer);