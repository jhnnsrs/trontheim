import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_DISPLAY, DEF_ROI, DEF_TRANSFORMATION} from "../../constants/definitions";
import type {HortenCanvas} from "../../alta/horten/canvas";
import {createHortenCanvas} from "../../alta/horten/canvas";
import * as constants from "../../constants";


export type DisplayStavanger = Stavanger & {
    display: HortenItem,
    rois: HortenTable,
    canvas: HortenCanvas,
    selectedRoi: HortenItem,
    transformations: HortenTable,
}


export const displayStavanger: DisplayStavanger = createStavanger({
    display: createHortenItem(DEF_DISPLAY),
    canvas: createHortenCanvas({type: constants.CANVAS, disableDraw: true}),
    rois: createHortenTable(DEF_ROI),
    selectedRoi: createHortenItem(DEF_ROI),
    transformations: createHortenTable(DEF_TRANSFORMATION),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
