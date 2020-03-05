import {createStavanger} from "../../alta/stavanger";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import {DEF_DISPLAY} from "../../constants/definitions";
import {createFlowConductor} from "../../conductors/createFlowConductor";
import type {FlowStavanger} from "../../maestros/flowMeastro";


export type DisplayFlowStavanger = FlowStavanger & {
    display: HortenItem,
}

const flowConductor = createFlowConductor()


export const displayFlowStavanger: DisplayFlowStavanger = createStavanger({
    ...flowConductor,
    display: createHortenItem(DEF_DISPLAY),})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
