import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {MaxISP} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";
import {DEF_TRANSFORMATION} from "../../constants/definitions";


export type  ClusterEvaluatorStavanger = Stavanger &{
    transformation: HortenItem,
    evaluating: HortenTable,
    clusterdata: HortenTable,
    edge: HortenEdge,
    settings: HortenMold


}


export const clusterEvaluatorStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [
        { in: constants.TRANSFORMATION, map: "transformation"},
        ]}),
    settings: createHortenMold({type:"settings"}),
    transformation: createHortenItem(DEF_TRANSFORMATION),
    evaluating: createHortenTable({type: constants.EVALUATING, url: "evaluatings"}),
    clusterdata:  createHortenTable({type:constants.CLUSTERDATA, url:"clusterdata"}),
})



export default connectOpera(clusterEvaluatorStavanger)(orchestraterEpic)(MaxISP);