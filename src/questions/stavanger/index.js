import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";
import {DEF_ANSWER, DEF_ANSWERING, DEF_ORACLE, DEF_QUESTION, DEF_USER} from "../../constants/definitions";


export type QuestionsStavanger = Stavanger & {
    creator: HortenItem,
    questions: HortenTable,
    newQuestion: HortenMold,
    answers: HortenTable,
    answerings: HortenTable,
    oracles: HortenTable,
}


export const questionsStavanger: QuestionsStavanger = createStavanger({
    creator: createHortenItem(DEF_USER),
    newQuestion: createHortenMold({type:"newQuestion",validator:null}),
    questions: createHortenTable(DEF_QUESTION),
    answers: createHortenTable(DEF_ANSWER),
    oracles: createHortenTable(DEF_ORACLE),
    answerings: createHortenTable(DEF_ANSWERING),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
