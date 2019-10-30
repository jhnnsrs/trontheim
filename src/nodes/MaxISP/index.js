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


export type  LineRectStavanger = Stavanger &{
    representations: HortenTable,
    representation: HortenItem,
    filterings: HortenTable,
    edge: HortenEdge,
    settings: HortenMold


}


export const lineRectStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.REPRESENTATION, map: "representation"}]}),
    settings: createHortenMold({type: "settings"}),
    representation: createHortenItem({type: constants.REPRESENTATION, url: "representations"}),
    filterings: createHortenTable({type: constants.FILTERING, url: "filterings"}),
    representations:  createHortenTable({type:constants.REPRESENTATION, url:"representations"}),
})



export default connectOpera(lineRectStavanger)(orchestraterEpic)(MaxISP);