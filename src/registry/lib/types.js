import type {HortenNode} from "../../alta/horten/node";
import type {HortenGraph} from "../../alta/horten/graph";
import type {HortenRegistry} from "../../alta/horten/registry";

export interface GraphStavanger {
    graph: HortenGraph,
    registry: HortenRegistry
}

export interface NodeStavanger {
    parent: GraphStavanger,
    node: HortenNode
}