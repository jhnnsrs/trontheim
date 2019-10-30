import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import type {HortenDetail} from "../../alta/horten/detail";
import type {HortenList} from "../../alta/horten/list";
import type {HortenForm} from "../../alta/horten/form";
import {createHortenForm} from "../../alta/horten/form";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import {
    DEF_ARNHEIMHOST,
    DEF_ENTITY,
    DEF_ENTITYNULL,
    DEF_NODE,
    DEF_NODEELEMENT,
    DEF_NODETYPE,
    DEF_VARIETY
} from "../../constants/definitions";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";


export type NodeBuilderStavanger = Stavanger & {
    nodeform: HortenMold,
    arnheimhosts: HortenList,
    nodes: HortenTable,
    selectedEntity: HortenDetail,
    varieties: HortenTable,
    entities: HortenTable,
    nodetypes: HortenList,
    nodeelements: HortenList,
}


export const nodeBuilderStavanger: NodeBuilderStavanger = createStavanger({
    selectedEntity: createHortenItem(DEF_ENTITYNULL),
    nodeform: createHortenMold({type: "nodeform", validator: null}),
    varieties: createHortenTable(DEF_VARIETY),
    arnheimhosts: createHortenTable(DEF_ARNHEIMHOST),
    entities: createHortenTable(DEF_ENTITY),
    nodes: createHortenTable(DEF_NODE),
    nodetypes: createHortenTable(DEF_NODETYPE),
    nodeelements: createHortenTable(DEF_NODEELEMENT),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
