import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import ExperimentAdder from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import {DEF_IMPULS, DEF_REPRESENTATION} from "../../constants/definitions";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";


export type  RepresentationGateStavanger = Stavanger &{
    impulsin: HortenItem,
    representation: HortenItem,
    edge: HortenEdge,
    settings: HortenMold


}


export const representationGateStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [
        { in: constants.STAR, map: "impulsin"},
        { in: constants.REPRESENTATION, map: "representation"},
        ]}),
    settings: createHortenMold({type: "settings", validator: null}),
    impulsin: createHortenItem(DEF_IMPULS),
    representation: createHortenItem(DEF_REPRESENTATION),
})



export default connectOpera(representationGateStavanger)(orchestraterEpic)(ExperimentAdder);