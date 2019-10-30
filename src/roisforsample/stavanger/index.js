import {createStavanger} from "../../alta/stavanger";
import type {HortenDetail} from "../../alta/horten/detail";
import {createHortenDetail} from "../../alta/horten/detail";
import * as constants from "../../constants"
import type {Stavanger} from "../../alta/stavanger";
import {createHortenList} from "../../alta/horten/list";
import type {HortenList} from "../../alta/horten/list";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenTable} from "../../alta/horten/table";
import {DEF_DISPLAY, DEF_EXHIBIT, DEF_FLOW, DEF_REPRESENTATION, DEF_ROI, DEF_SAMPLE} from "../../constants/definitions";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";


export type RoiForSampleStavanger = Stavanger & {
    sample: HortenItem,
    rois: HortenTable,
}

export const roiForSampleStavanger: RoiForSampleStavanger = createStavanger({
    sample: createHortenItem(DEF_SAMPLE),
    rois: createHortenTable(DEF_ROI),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
