import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {MaxISP} from "./container";
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
    DEF_BIOSERIES, DEF_CONVERSING,
    DEF_REPRESENTATION,
    DEF_SAMPLE,
    DEF_SETTINGS
} from "../../constants/definitions";
import {createHortenValue} from "../../alta/horten/value";
import type {HortenValue} from "../../alta/horten/value";


export type BioConverter = Stavanger &{
    bioseries: HortenValue,
    representations: HortenTable,
    samples: HortenTable,
    conversings: HortenTable,
    node: HortenNode,
    settings: HortenMold


}

export const ports = {
    ins: [
        { name: "bioseries" , type: constants.BIOSERIES, map: "bioseries" },
    ],
    outs: [
        {name: "sample", type: constants.SAMPLE},
        {name: "representation", type: constants.REPRESENTATION}
    ]
}


export const bioConverterStavanger = createStavanger({
    node: createHortenNode({type: constants.NODE, ports: ports}),
    settings: createHortenMold(DEF_SETTINGS),
    bioseries: createHortenValue(DEF_BIOSERIES),
    conversings: createHortenTable(DEF_CONVERSING),
    samples:  createHortenTable(DEF_SAMPLE),
    representations:  createHortenTable(DEF_REPRESENTATION),
})



export default connectOpera(bioConverterStavanger)(orchestraterEpic)(MaxISP);