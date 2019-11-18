import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {DEF_EXPERIMENTALGROUP, DEF_SAMPLE} from "../../constants/definitions";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";


export type ExperimentalGroupStavanger = Stavanger & {
    samples: HortenTable,
    selectedSample: HortenItem,
    experimentalGroup: HortenItem,
}

export const experimentalGroupStavanger: ExperimentalGroupStavanger = createStavanger({
    experimentalGroup: createHortenItem(DEF_EXPERIMENTALGROUP),
    selectedSample: createHortenItem(DEF_SAMPLE),
    samples: createHortenTable(DEF_SAMPLE),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
