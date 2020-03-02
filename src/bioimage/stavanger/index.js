import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import {
    DEF_ANALYZER,
    DEF_ANALYZING,
    DEF_BIOIMAGE,
    DEF_BIOSERIES,
    DEF_FLOW,
    DEF_SAMPLE
} from "../../constants/definitions";
import * as constants from "../../constants";


export type BioImageStavanger = Stavanger & {
    bioimage: HortenItem,
    bioseries: HortenTable,
    samples: HortenTable,
    sampleflows: HortenTable,
    bioseriesflows: HortenTable,
    analyzers: HortenTable,
    analyzings: HortenTable,
}


export const bioImageStavanger: BioImageStavanger = createStavanger({
    bioimage: createHortenItem(DEF_BIOIMAGE),
    samples: createHortenTable(DEF_SAMPLE),
    bioseries: createHortenTable(DEF_BIOSERIES),
    sampleflows: createHortenTable(DEF_FLOW),
    bioseriesflows: createHortenTable(DEF_FLOW),


    analyzers: createHortenTable(DEF_ANALYZER),
    analyzings: createHortenTable(DEF_ANALYZING),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
