import type {HortenNode} from "../../alta/horten/node";
import type {Stavanger} from "../../alta/stavanger";
import {createHortenNode} from "../../alta/horten/node";
import {createStavanger} from "../../alta/stavanger";
import {createHortenDetail} from "../../alta/horten/detail";
import {Container} from "./container";
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
import {createHortenEdge} from "../../alta/horten/edge";
import type {HortenEdge} from "../../alta/horten/edge";


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