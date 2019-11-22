import {createStavanger} from "../../alta/stavanger";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import {DEF_FLOW, DEF_LOCKER, DEF_SAMPLE} from "../../constants/definitions";
import type {FlowStavanger} from "../../maestros/flowMeastro";
import {createFlowConductor} from "../../conductors/createFlowConductor";


export type SampleFlowStavanger = FlowStavanger & {
    sample: HortenItem,
}

const flowConductor = createFlowConductor()

export const sampleFlowStavanger: SampleFlowStavanger = createStavanger({
    ...flowConductor,
    sample: createHortenItem(DEF_SAMPLE),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
