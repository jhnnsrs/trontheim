import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenForm} from "../../alta/horten/form";
import {createHortenForm} from "../../alta/horten/form";
import Opera from "./Opera";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_BIOSERIES, DEF_SETTINGS} from "../../constants/definitions";
import type {HortenNode} from "../../alta/horten/node";
import {createHortenMold} from "../../alta/horten/mold";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenNode} from "../../alta/horten/node";


export type  BioSeriesCollectorStavanger = Stavanger &{
    bioseries: HortenItem,
    bioserieslist: HortenTable,
    node: HortenNode,
    settings: HortenMold


}

export const ports = {
    ins: [
        { name: "bioseries" , type: constants.BIOSERIES, map: "bioseries" },
    ],
    outs: [
        {name: "bioseries", type: constants.BIOSERIES}
    ]
}



export const bioSeriesCollectorStavanger = createStavanger({
    node: createHortenNode({type: constants.NODE, ports: ports}),
    settings: createHortenMold(DEF_SETTINGS),
    bioseries: createHortenItem(DEF_BIOSERIES),
    bioserieslist: createHortenTable(DEF_BIOSERIES),
})



export default connectOpera(bioSeriesCollectorStavanger)(orchestraterEpic)(Opera);