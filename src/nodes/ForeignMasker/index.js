import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {MaxISP} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenForm} from "../../alta/horten/form";
import {createHortenForm} from "../../alta/horten/form";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";


export type  ForeignMaskerStavanger = Stavanger &{
    reflection: HortenItem,
    settings: HortenForm,
    foreign: HortenTable,
    status: HortenTable,
    edge: HortenEdge,
    masks: HortenTable


}


export const foreignMaskerStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.REFLECTION, map: "reflection"}]}),
    foreign: createHortenTable({type: constants.FOREIGNODEREQUEST, url: "foreignnode"}),
    status: createHortenTable({type: constants.FOREIGNODEREQUEST, url: "foreignnodestatus"}),
    settings: createHortenForm("settings"),
    reflection: createHortenItem({type: constants.REFLECTION, url: "reflections"}),
    masks: createHortenTable({type: constants.MASK, url: "masks"})
})



export default connectOpera(foreignMaskerStavanger)(orchestraterEpic)(MaxISP);