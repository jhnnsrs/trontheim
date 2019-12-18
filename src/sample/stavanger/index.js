import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_DISPLAY, DEF_EXHIBIT, DEF_FLOW, DEF_REPRESENTATION, DEF_SAMPLE} from "../../constants/definitions";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";


export type SampleStavanger = Stavanger & {
    sample: HortenItem,
    selectedRepresentation: HortenItem,
    representations: HortenTable,
    displays: HortenTable,
    exhibits: HortenTable,
    displayflows: HortenTable,
    sampleflows: HortenTable,
    exhibitflows: HortenTable,
}

export const sampleStavanger: SampleStavanger = createStavanger({
    sample: createHortenItem(DEF_SAMPLE),
    selectedRepresentation: createHortenItem(DEF_REPRESENTATION),
    representations: createHortenTable(DEF_REPRESENTATION),
    displayflows: createHortenTable(DEF_FLOW),
    sampleflows: createHortenTable(DEF_FLOW),
    exhibitflows: createHortenTable(DEF_FLOW),
    displays: createHortenTable(DEF_DISPLAY),
    exhibits: createHortenTable(DEF_EXHIBIT),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
