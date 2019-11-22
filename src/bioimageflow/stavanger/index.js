import {createStavanger} from "../../alta/stavanger";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import {DEF_BIOIMAGE, DEF_FLOW, DEF_LOCKER} from "../../constants/definitions";
import type {FlowStavanger} from "../../maestros/flowMeastro";
import {createFlowConductor} from "../../conductors/createFlowConductor";


export type BioImageFlowStavanger = FlowStavanger & {
    bioimage: HortenItem,
}

const flowConductor = createFlowConductor()

export const bioImageFlowStavanger: BioImageFlowStavanger = createStavanger({
    ...flowConductor,
    bioimage: createHortenItem(DEF_BIOIMAGE),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
