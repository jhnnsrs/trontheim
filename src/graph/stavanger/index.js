import {createStavanger} from "../../alta/stavanger";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import {DEF_BIOIMAGE, DEF_FLOW, DEF_LOCKER, DEF_UNKNOWN} from "../../constants/definitions";
import type {FlowStavanger} from "../../maestros/flowMeastro";
import {createFlowConductor} from "../../conductors/createFlowConductor";


export type GraphStavanger = FlowStavanger & {
    first: HortenItem,
    second: HortenItem,
}

const flowConductor = createFlowConductor()

export const bioImageFlowStavanger: GraphStavanger = createStavanger({
    ...flowConductor,
    first: createHortenItem(DEF_UNKNOWN),
    second: createHortenItem(DEF_UNKNOWN),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
