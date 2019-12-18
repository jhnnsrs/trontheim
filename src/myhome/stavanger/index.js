import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenForm} from "../../alta/horten/form";
import {createHortenMold} from "../../alta/horten/mold";


export type HomeStavanger = Stavanger & {
    experimentForm: HortenForm,
    experiments: HortenTable,
    samples: HortenTable,
    displays: HortenTable,
}

export const homeStavanger: HomeStavanger = createStavanger({
    experimentForm: createHortenMold({type: "experimentForm"}),
    experiments: createHortenTable({type: constants.EXPERIMENT, url: "experiments"}),
    samples: createHortenTable({type: constants.SAMPLE, url: "samples"}),
    displays: createHortenTable({type: constants.DISPLAY, url: "displays"}),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
