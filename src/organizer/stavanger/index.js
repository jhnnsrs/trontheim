import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import {DEF_ANIMAL, DEF_EXPERIMENT, DEF_EXPERIMENTALGROUP, DEF_SAMPLE} from "../../constants/definitions";
import {createHortenItem} from "../../alta/horten/item";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";
import {createHortenDraggable} from "../../alta/horten/draggable";
import type {HortenDraggable} from "../../alta/horten/draggable";


export type OrganizerStavanger = Stavanger & {
    samples: HortenTable,
    animals: HortenTable,
    expgroups: HortenTable,
    draggable: HortenDraggable,
    selectedSample: HortenItem,
    newGroup: HortenMold,
    experiment: HortenItem,
}

export const organizerStavanger: OrganizerStavanger = createStavanger({
    experiment: createHortenItem(DEF_EXPERIMENT),
    draggable: createHortenDraggable({
        type: "dragger",
        context: {
            samples: [
                "samples",
                "sampleGroup1",
                "sampleGroup2"
            ],
        },
    }),
    samples: createHortenTable(DEF_SAMPLE),
    sampleGroup1: createHortenTable(DEF_SAMPLE),
    sampleGroup2: createHortenTable(DEF_SAMPLE),
    animals: createHortenTable(DEF_ANIMAL),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
