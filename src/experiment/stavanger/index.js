import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {DEF_ANIMAL, DEF_EXPERIMENT, DEF_EXPERIMENTALGROUP, DEF_SAMPLE} from "../../constants/definitions";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";


export type ExperimentStavanger = Stavanger & {
    samples: HortenTable,
    animals: HortenTable,
    expgroups: HortenTable,
    selectedSample: HortenItem,
    newGroup: HortenMold,
    experiment: HortenItem,
}

export const experimentStavanger: ExperimentStavanger = createStavanger({
    experiment: createHortenItem(DEF_EXPERIMENT),
    newGroup: createHortenMold({type: "newGroup"}),
    selectedSample: createHortenItem(DEF_SAMPLE),
    samples: createHortenTable(DEF_SAMPLE),
    expgroups: createHortenTable(DEF_EXPERIMENTALGROUP),

    animals: createHortenTable(DEF_ANIMAL),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
