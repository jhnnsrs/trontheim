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
import {DEF_ANALYZING, DEF_BIOIMAGE, DEF_BIOSERIES} from "../../constants/definitions";
import {createHortenValue} from "../../alta/horten/value";
import type {HortenValue} from "../../alta/horten/value";


export type LineTransformer = Stavanger &{
    bioimage: HortenValue,
    analyzings: HortenTable,
    bioseries: HortenTable,
    node: HortenNode,
    settings: HortenMold


}

export const ports = {
    ins: [
        { name: "bioimage" , type: constants.BIOIMAGE, map: "bioimage" },
    ],
    outs: [
        {name: "bioseries", type: constants.BIOSERIES}
    ]
}


export const lineTransformerStavanger = createStavanger({
    node: createHortenNode({type: constants.NODE, ports: ports}),
    settings: createHortenMold({type:"settings"}),
    bioimage: createHortenValue(DEF_BIOIMAGE),
    analyzings: createHortenTable(DEF_ANALYZING),
    bioseries:  createHortenTable(DEF_BIOSERIES),
})



export default connectOpera(lineTransformerStavanger)(orchestraterEpic)(MaxISP);