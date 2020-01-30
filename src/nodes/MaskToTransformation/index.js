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
import {DEF_TRANSFORMATION} from "../../constants/definitions";


export type  MaskMasking = Stavanger &{
    transformation: HortenItem,
    mask: HortenItem,
    revampings: HortenTable,
    transformations: HortenTable,
    edge: HortenEdge,
    settings: HortenMold


}


export const maskMaskingStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [
        { in: constants.TRANSFORMATION, map: "transformation"},
        { in: constants.MASK, map: "mask"},
        ]}),
    settings: createHortenMold({type:"settings"}),
    transformation: createHortenItem(DEF_TRANSFORMATION),
    mask: createHortenItem({type: constants.MASK, url: "mask"}),
    revampings: createHortenTable({type: constants.REVAMPING, url: "revampings"}),
    transformations:  createHortenTable({type:constants.TRANSFORMATION, url:"transformation"}),
})



export default connectOpera(maskMaskingStavanger)(orchestraterEpic)(MaxISP);