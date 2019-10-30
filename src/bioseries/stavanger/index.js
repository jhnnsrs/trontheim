import {createStavanger} from "../../alta/stavanger";
import type {HortenDetail} from "../../alta/horten/detail";
import {createHortenDetail} from "../../alta/horten/detail";
import * as constants from "../../constants"
import type {Stavanger} from "../../alta/stavanger";
import {createHortenList} from "../../alta/horten/list";
import type {HortenList} from "../../alta/horten/list";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_BIOSERIES} from "../../constants/definitions";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenItem} from "../../alta/horten/item";


export type BioSeriesStavanger = Stavanger & {
    bioseries: HortenItem,
    representations: HortenList,
    samples: HortenList,
    sampleflows: HortenList,
    representationflows: HortenList,
}

export const bioSeriesStavanger: BioSeriesStavanger = createStavanger({
    bioseries: createHortenItem(DEF_BIOSERIES),
    samples: createHortenTable({type: constants.SAMPLE, url: "samples"}),
    representations: createHortenTable({type: constants.REPRESENTATION, url: "representations"}),
    sampleflows: createHortenTable({type: constants.FLOW, url: "filterflows"}),
    representationflows: createHortenTable({type: constants.FLOW, url: "filterflows"}),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
