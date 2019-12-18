import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {Container} from "./container";
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


export type  BioMetaStavanger = Stavanger &{
    bioseries: HortenTable,
    bioimage: HortenItem,
    analyzings: HortenTable,
    edge: HortenEdge,
    settings: HortenForm


}


export const bioMetaStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.BIOIMAGE, map: "bioimage"}]}),
    settings: createHortenForm("settings"),
    bioimage: createHortenItem({type: constants.BIOIMAGE, url: "bioimages"}),
    analyzings: createHortenTable({type: constants.ANALYZING, url: "analyzings"}),
    bioseries:  createHortenTable({type:constants.BIOSERIES, url:"bioseries"}),
})



export default connectOpera(bioMetaStavanger)(orchestraterEpic)(Container);