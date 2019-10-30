import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import type {HortenDetail} from "../../alta/horten/detail";
import {createHortenDetail} from "../../alta/horten/detail";
import * as constants from "../../constants"
import type {HortenList} from "../../alta/horten/list";
import {
    DEF_CLUSTERDATA,
    DEF_REFLECTION,
    DEF_ROI,
    DEF_TRANSFORMATION,
    DEF_VOLUMEDATA
} from "../../constants/definitions";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenItem} from "../../alta/horten/item";


export type RoiStavanger = Stavanger & {
    roi: HortenItem,
    volumedatas: HortenTable,
    clusterdata: HortenTable,
    transformations: HortenTable,
    reflections: HortenTable,
}

export const roiStavanger: RoiStavanger = createStavanger({
    roi: createHortenItem(DEF_ROI),
    volumedatas: createHortenTable(DEF_VOLUMEDATA),
    clusterdata: createHortenTable(DEF_CLUSTERDATA),
    transformations: createHortenTable(DEF_TRANSFORMATION),
    reflections: createHortenTable(DEF_REFLECTION),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
