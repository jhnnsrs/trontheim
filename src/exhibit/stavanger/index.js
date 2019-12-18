import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import type {HortenDetail} from "../../alta/horten/detail";
import * as constants from "../../constants"
import type {HortenList} from "../../alta/horten/list";
import {createHortenItem} from "../../alta/horten/item";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenCube} from "../../alta/horten/cube";
import {createHortenCube} from "../../alta/horten/cube";


export type ExhibitStavanger = Stavanger & {
    exhibit: HortenDetail,
    rois: HortenList,
    cube: HortenCube,
    selectedRoi: HortenDetail,
    transformations: HortenList,
    cube: HortenCube,
}

export const exhibitStavanger: ExhibitStavanger = createStavanger({
    exhibit: createHortenItem({type: constants.EXHIBIT,url:"exhibits"}),
    cube: createHortenCube({type: "CUBE"}),
    rois: createHortenTable({type: constants.ROI,url:"rois"}),
    selectedRoi: createHortenItem({type: constants.ROI, url:"rois"}),
    transformations: createHortenTable({type: constants.TRANSFORMATION,url:"transformations"}),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
