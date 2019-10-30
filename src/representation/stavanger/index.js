import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import type {HortenList} from "../../alta/horten/list";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import {DEF_DISPLAY, DEF_EXHIBIT, DEF_FLOW, DEF_REPRESENTATION, DEF_ROI} from "../../constants/definitions";


export type RepresentationStavanger = Stavanger & {
    representation: HortenItem,
    displays: HortenTable,
    exhibits: HortenTable,
    rois: HortenTable,
    displayflows: HortenTable,
    roiflows: HortenTable,
}


export const representationStavanger: RepresentationStavanger = createStavanger({
    representation: createHortenItem(DEF_REPRESENTATION),
    exhibits: createHortenTable(DEF_EXHIBIT),
    displays: createHortenTable(DEF_DISPLAY),
    rois: createHortenTable(DEF_ROI),
    displayflows: createHortenTable(DEF_FLOW),
    roiflows: createHortenTable(DEF_FLOW),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
