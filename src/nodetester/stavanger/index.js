import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenNodes} from "../../alta/horten/nodes";
import {createHortenNodes} from "../../alta/horten/nodes";
import {createHortenNomogram} from "../../alta/horten/nomogram";


export type NodeTesterStavanger = Stavanger & {
    nodes: HortenNodes,
    node: HortenItem
}

export const nodetestStavanger: NodeTesterStavanger = createStavanger({
    nodes: createHortenNodes({type: "NODES"}),
    graph: createHortenNomogram({type: "graph"}),
    node: createHortenItem({type: constants.NODE, url: "nodes"}),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
