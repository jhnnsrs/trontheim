import type {HortenNode} from "../../alta/horten/node";
import type {Stavanger} from "../../alta/stavanger";
import {createHortenNode} from "../../alta/horten/node";
import {createStavanger} from "../../alta/stavanger";
import {createHortenDetail} from "../../alta/horten/detail";
import {TwoDShow} from "./container";
import {connectOpera} from "../../alta/react";
import type {HortenDetail} from "../../alta/horten/detail";
import {orchestraterEpic} from "./orchestrater";
import type {HortenList} from "../../alta/horten/list";
import {createHortenList} from "../../alta/horten/list";
import * as constants from "../../constants"
import {createHortenCanvas} from "../../alta/horten/canvas";
import type {HortenCanvas} from "../../alta/horten/canvas";
import {createHortenForm} from "../../alta/horten/form";
import type {HortenForm} from "../../alta/horten/form";
import {createHortenItem} from "../../alta/horten/item";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenCube} from "../../alta/horten/cube";
import type {HortenCube} from "../../alta/horten/cube";
import {createHortenEdge} from "../../alta/horten/edge";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenMold} from "../../alta/horten/mold";
import type {HortenMold} from "../../alta/horten/mold";
import {DEF_REFLECTION} from "../../constants/definitions";


export type
    ClusterDataShowStavanger = Stavanger &{
    data: HortenItem,
    reflection: HortenItem,
    settings: HortenMold,
    edge: HortenEdge

}


export const clusterDataShowStavanger = createStavanger({
    edge: createHortenEdge({
        type: constants.EDGE,
        ins: [
            {in: constants.CLUSTERDATA, map: "data"},
            {in: constants.REFLECTION, map: "reflection"}],
        isPoppable: true
    }),
    settings: createHortenMold({type:"settings"}),
    data: createHortenItem({type: constants.CLUSTERDATA,url: "clusterdata"}),
    reflection: createHortenItem(DEF_REFLECTION),
})




export default connectOpera(clusterDataShowStavanger)(orchestraterEpic)(TwoDShow);