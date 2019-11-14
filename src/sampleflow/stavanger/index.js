import {createStavanger} from "../../alta/stavanger";
import {createHortenNodes} from "../../alta/horten/nodes";
import type {HortenNodes} from "../../alta/horten/nodes";
import type {HortenGraph} from "../../alta/horten/graph";
import * as constants from "../../constants"
import type {Stavanger} from "../../alta/stavanger";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenNomogram} from "../../alta/horten/nomogram";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenTable} from "../../alta/horten/table";
import type {HortenNomogramNode} from "../../alta/horten/nomogram";


export type SampleFlowStavanger = Stavanger & {
    nodes: HortenNodes,
    graph: HortenGraph,
    flow: HortenItem,
    sample: HortenItem,
    layout: HortenItem,
    possibleLayouts: HortenTable,
}

export const sampleFlowStavanger: SampleFlowStavanger = createStavanger({
    nodes: createHortenNodes({type: "NODES"}),
    graph: createHortenNomogram({type: "GRAPH",
        start: (nodes) => nodes.find( (node: HortenNomogramNode) => node.type === "watcher")
    }),
    flow: createHortenItem({type: constants.FLOW, url: "filterflows"}),
    sample: createHortenItem({type: constants.SAMPLE, url: "samples"}),
    layout: createHortenItem({type: constants.LAYOUT, url: "layouts"}),
    possibleLayouts: createHortenTable({type: constants.LAYOUT, url: "layouts"})
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
