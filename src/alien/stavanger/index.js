import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import * as constants from "../../constants"
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenNodes} from "../../alta/horten/nodes";
import {createHortenNodes} from "../../alta/horten/nodes";
import type {HortenNomogram} from "../../alta/horten/nomogram";
import {createHortenNomogram} from "../../alta/horten/nomogram";
import {DEF_FOREIGNNODEREQUEST} from "../../constants/definitions";


export type AlienStavanger = Stavanger & {
    nodes: HortenNodes,
    graph: HortenNomogram,
    node: HortenItem,
    noderequests: HortenTable
}

export const alienStavanger: AlienStavanger = createStavanger({
    nodes: createHortenNodes({type: "NODES"}),
    graph: createHortenNomogram({type: "graph"}),
    noderequests: createHortenTable(DEF_FOREIGNNODEREQUEST),
    node: createHortenItem({type: constants.NODE, url: "nodes"}),

})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
