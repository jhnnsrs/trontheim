import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {ImageMutater} from "./container";
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