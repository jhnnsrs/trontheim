import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenNomogramNode} from "../../alta/horten/nomogram";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {DEF_LOCKER} from "../../constants/definitions";
import type {HortenGraph} from "../../alta/horten/graph";
import {createHortenGraph} from "../../alta/horten/graph";
import type {HortenRegistry} from "../../alta/horten/registry";
import {createHortenRegistry} from "../../alta/horten/registry";
import {createHortenPage} from "../../alta/horten/page";


export type ExternalStavanger = Stavanger & {
    registry: HortenRegistry,
    graph: HortenGraph,
    external: HortenItem,
    externalrequests: HortenTable,
}

export const externalStavanger: ExternalStavanger = createStavanger({
    page: createHortenPage({type: "page", reset: true}), // Overwrites Standard Page
    registry: createHortenRegistry({type: "NODES"}),
    graph: createHortenGraph({type: "GRAPH",
        start: (nodes) => nodes.find( (node: HortenNomogramNode) => node.type === "watcher")
    }),
    external: createHortenItem({type: constants.EXTERNAL, url: "externals"}),
    externalrequests: createHortenTable({type: constants.EXTERNALREQUEST, url: "externalrequests"})
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
