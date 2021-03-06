import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import * as constants from "../../constants"
import type {HortenList} from "../../alta/horten/list";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_ANALYZER, DEF_ANALYZING, DEF_BIOSERIES, DEF_CONVERSING, DEF_CONVERTER} from "../../constants/definitions";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";


export type BioSeriesStavanger = Stavanger & {
    bioseries: HortenItem,
    representations: HortenList,
    samples: HortenList,
    sampleflows: HortenList,
    representationflows: HortenList,

    converters: HortenTable,
    conversings: HortenTable,
}

export const bioSeriesStavanger: BioSeriesStavanger = createStavanger({
    bioseries: createHortenItem(DEF_BIOSERIES),
    samples: createHortenTable({type: constants.SAMPLE, url: "samples"}),
    representations: createHortenTable({type: constants.REPRESENTATION, url: "representations"}),
    sampleflows: createHortenTable({type: constants.FLOW, url: "filterflows"}),
    representationflows: createHortenTable({type: constants.FLOW, url: "filterflows"}),



    converters: createHortenTable(DEF_CONVERTER),
    conversings: createHortenTable(DEF_CONVERSING),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
