import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {TwoDShow} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";
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