import {createStavanger} from "../../alta/stavanger";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import {DEF_BIOIMAGE, DEF_FLOW, DEF_LOCKER, DEF_REPRESENTATION} from "../../constants/definitions";
import type {FlowStavanger} from "../../maestros/flowMeastro";
import {createFlowConductor} from "../../conductors/createFlowConductor";


export type RepresentationFlowStavanger = FlowStavanger & {
    representation: HortenItem,
}

const flowConductor = createFlowConductor()

export const representationFlowStavanger: RepresentationFlowStavanger = createStavanger({
    ...flowConductor,
    representation: createHortenItem(DEF_REPRESENTATION),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
