import type {HortenNode} from "../../alta/horten/node";
import type {Stavanger} from "../../alta/stavanger";
import {createHortenNode} from "../../alta/horten/node";
import {createStavanger} from "../../alta/stavanger";
import {createHortenDetail} from "../../alta/horten/detail";
import {connectOpera} from "../../alta/react";
import type {HortenDetail} from "../../alta/horten/detail";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import {createHortenForm} from "../../alta/horten/form";
import type {HortenForm} from "../../alta/horten/form";
import Opera from "./Opera";
import {createHortenList} from "../../alta/horten/list";
import type {HortenList} from "../../alta/horten/list";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenEdge} from "../../alta/horten/edge";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenTable} from "../../alta/horten/table";


export type  BioImageWatcherStavanger = Stavanger &{
    bioimage: HortenItem,
    bioimages: HortenTable,
    edge: HortenEdge,
    settings: HortenForm


}


export const bioImageWatcherStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.BIOIMAGE, map: "bioimage"}]}),
    settings: createHortenForm("settings"),
    bioimage: createHortenItem({type: constants.BIOIMAGE, url: "bioimages"}),
    bioimages: createHortenTable({type: constants.BIOIMAGE, url: "bioimages"}),
})



export default connectOpera(bioImageWatcherStavanger)(orchestraterEpic)(Opera);