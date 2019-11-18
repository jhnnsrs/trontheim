import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import Opera from "./Opera";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenNode} from "../../alta/horten/node";
import {createHortenNode} from "../../alta/horten/node";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";


export type  BioImageWatcherStavanger = Stavanger &{
    bioimage: HortenItem,
    bioimages: HortenTable,
    edge: HortenNode,
    settings: HortenMold


}


export const bioImageWatcherStavanger = createStavanger({
    edge: createHortenNode({type: constants.NODE, ins: [{ in: constants.BIOIMAGE, map: "bioimage"}]}),
    settings: createHortenMold({type: "settings"}),
    bioimage: createHortenItem({type: constants.BIOIMAGE, url: "bioimages"}),
    bioimages: createHortenTable({type: constants.BIOIMAGE, url: "bioimages"}),
})



export default connectOpera(bioImageWatcherStavanger)(orchestraterEpic)(Opera);