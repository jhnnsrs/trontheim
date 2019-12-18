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


export type  BioConverterStavanger = Stavanger &{
    samples: HortenTable,
    bioseries: HortenItem,
    conversings: HortenTable,
    representations: HortenTable,
    edge: HortenEdge,
    settings: HortenForm


}


export const bioConverterStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.BIOSERIES, map: "bioseries"}]}),
    settings: createHortenForm("settings"),
    bioseries: createHortenItem({type: constants.BIOSERIES, url: "bioseries"}),
    conversings: createHortenTable({type: constants.CONVERSING, url: "conversings"}),
    samples:  createHortenTable({type:constants.SAMPLE, url:"samples"}),
    representations:  createHortenTable({type:constants.REPRESENTATION, url:"representations"}),
})



export default connectOpera(bioConverterStavanger)(orchestraterEpic)(MaxISP);