import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import type {HortenNodes} from "../../alta/horten/nodes";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenNomogram, HortenNomogramNode} from "../../alta/horten/nomogram";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_LOCKER} from "../../constants/definitions";
import {createHortenGraph} from "../../alta/horten/graph";
import {createHortenRegistry} from "../../alta/horten/registry";
import type {HortenRegistry} from "../../alta/horten/registry";
import type {HortenGraph} from "../../alta/horten/graph";
import {createHortenPage} from "../../alta/horten/page";


export type LockerFlowStavanger = Stavanger & {
    registry: HortenRegistry,
    graph: HortenGraph,
    flow: HortenItem,
    locker: HortenItem,
    layout: HortenItem,
    possibleLayouts: HortenTable,
}

export const lockerFlowStavanger: LockerFlowStavanger = createStavanger({
    page: createHortenPage({type: "page", reset: true}), // Overwrites Standard Page
    registry: createHortenRegistry({type: "NODES"}),
    graph: createHortenGraph({type: "GRAPH",
        start: (nodes) => nodes.find( (node: HortenNomogramNode) => node.type === "watcher")
    }),
    flow: createHortenItem({type: constants.FLOW, url: "filterflows"}),
    locker: createHortenItem(DEF_LOCKER),
    layout: createHortenItem({type: constants.LAYOUT, url: "layouts"}),
    possibleLayouts: createHortenTable({type: constants.LAYOUT, url: "layouts"})
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
