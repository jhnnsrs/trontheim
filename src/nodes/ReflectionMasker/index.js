import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {TwoDShow} from "./container";
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
import type {HortenFabric} from "../../alta/horten/fabric";
import {createHortenFabric} from "../../alta/horten/fabric";


export type  ReflectionMaskerStavanger = Stavanger &{
    reflection: HortenItem,
    masks: HortenTable,
    settings: HortenForm,
    edge: HortenEdge,
    fabric: HortenFabric

}


export const reflectionMaskerStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [
            { in: constants.REFLECTION, map: "reflection"},
            { in: constants.MASK, map: "masks"}]}),
    settings: createHortenForm("settings"),
    reflection: createHortenItem({type: constants.REFLECTION,url: "reflections"}),
    masks: createHortenTable({type: constants.MASK,url:"masks"}),
    fabric: createHortenFabric({type: constants.FABRIC}),
})




export default connectOpera(reflectionMaskerStavanger)(orchestraterEpic)(TwoDShow);