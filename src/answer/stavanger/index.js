import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_ANSWER, DEF_EXCELEXPORT, DEF_PROFILE, DEF_VISUALIZER, DEF_VISUALIZING} from "../../constants/definitions";


export type AnswerStavanger = Stavanger & {
    answer: HortenItem,
    visualizers: HortenTable,
    visualizings: HortenTable,
    profiles: HortenTable,
    excelexports: HortenTable,
}


export const answerStavanger: AnswerStavanger = createStavanger({
    answer: createHortenItem(DEF_ANSWER),
    visualizers: createHortenTable(DEF_VISUALIZER),
    visualizings: createHortenTable(DEF_VISUALIZING),
    profiles: createHortenTable(DEF_PROFILE),
    excelexports: createHortenTable(DEF_EXCELEXPORT),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
