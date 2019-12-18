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
import {DEF_IMPULS} from "../../constants/definitions";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";


export type  ImpulsorStavanger = Stavanger &{
    impulsin: HortenItem,
    impulsout: HortenItem,
    edge: HortenEdge,
    settings: HortenMold


}


export const impulsorStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: "*", map: "impulsin"}]}),
    settings: createHortenMold({type: "settings", validator: null}),
    impulsin: createHortenItem(DEF_IMPULS),
    impulsout: createHortenItem(DEF_IMPULS),
})



export default connectOpera(impulsorStavanger)(orchestraterEpic)(ExperimentAdder);