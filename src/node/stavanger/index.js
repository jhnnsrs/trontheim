import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import {DEF_NODE} from "../../constants/definitions";


export type NodeStavanger = Stavanger & {
    node: HortenItem,
}

export const nodeStavanger: NodeStavanger = createStavanger({
    node: createHortenItem(DEF_NODE),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
