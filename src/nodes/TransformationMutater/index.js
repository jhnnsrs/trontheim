import type {HortenNode} from "../../alta/horten/node";
import type {Stavanger} from "../../alta/stavanger";
import {createHortenNode} from "../../alta/horten/node";
import {createStavanger} from "../../alta/stavanger";
import {createHortenDetail} from "../../alta/horten/detail";
import {ImageMutater} from "./container";
import {connectOpera} from "../../alta/react";
import type {HortenDetail} from "../../alta/horten/detail";
import {orchestraterEpic} from "./orchestrater";
import type {HortenList} from "../../alta/horten/list";
import {createHortenList} from "../../alta/horten/list";
import * as constants from "../../constants"
import {createHortenForm} from "../../alta/horten/form";
import type {HortenForm} from "../../alta/horten/form";
import {createHortenItem} from "../../alta/horten/item";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenTable} from "../../alta/horten/table";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenEdge} from "../../alta/horten/edge";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenMold} from "../../alta/horten/mold";
import type {HortenMold} from "../../alta/horten/mold";


export type  TransformationMutaterStavanger = Stavanger &{
    mutatings: HortenTable,
    transformation: HortenItem,
    reflections: HortenTable,
    edge: HortenEdge,
    settings: HortenMold


}


export const transformationMutaterStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.TRANSFORMATION, map: "transformation"}]}),
    settings: createHortenMold({type:"settings"}),
    transformation: createHortenItem({type: constants.TRANSFORMATION, url: "transformations"}),
    mutatings: createHortenTable({type: constants.MUTATING,url: "mutatings"}),
    reflections:  createHortenTable({type: constants.REFLECTION,url: "reflections"}),
})



export default connectOpera(transformationMutaterStavanger)(orchestraterEpic)(ImageMutater);