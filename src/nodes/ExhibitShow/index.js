import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {TwoDShow} from "./container";
import {connectOpera} from "../../alta/react";
import {orchestraterEpic} from "./orchestrater";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenCube} from "../../alta/horten/cube";
import {createHortenCube} from "../../alta/horten/cube";
import type {HortenEdge} from "../../alta/horten/edge";
import {createHortenEdge} from "../../alta/horten/edge";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";


export type  ExhibitShowStavanger = Stavanger &{
    exhibitin: HortenItem,
    exhibit: HortenItem,
    rois: HortenTable,
    cube: HortenCube,
    settings: HortenMold,
    edge: HortenEdge

}


export const exhibitShowStavanger = createStavanger({
    edge: createHortenEdge({type: constants.EDGE, ins: [{ in: constants.EXHIBIT, map: "exhibitin"}], isPoppable: true}),
    settings: createHortenMold({type:"settings"}),
    exhibitin: createHortenItem({type: constants.EXHIBIT,url: "exhibits"}),
    exhibit: createHortenItem({type: constants.EXHIBIT,url: "exhibits"}),
    rois: createHortenTable({type: constants.ROI,url:"rois"}),
    cube: createHortenCube({type: "nothing"})
})




export default connectOpera(exhibitShowStavanger)(orchestraterEpic)(TwoDShow);