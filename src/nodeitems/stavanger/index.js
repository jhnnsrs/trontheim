import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";
import {DEF_NODE} from "../../constants/definitions";


export type NodeItemsStavanger = Stavanger & {
    newNode: HortenMold,
    selectedNode: HortenItem,
    nodes: HortenTable,
}

export const nodeItemsStavanger: NodeItemsStavanger = createStavanger({
    newNode: createHortenMold({type:"newNode",validator:null}),
    selectedNode: createHortenItem(DEF_NODE),
    nodes: createHortenTable(DEF_NODE),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
