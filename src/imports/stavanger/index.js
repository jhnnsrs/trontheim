import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import * as constants from "../../constants"
import type {HortenItem} from "../../alta/horten/item";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenMold} from "../../alta/horten/mold";
import {createHortenMold} from "../../alta/horten/mold";
import {DEF_BIOIMAGE, DEF_LOCKER} from "../../constants/definitions";


export type ImportsStavanger = Stavanger & {
    creator: HortenItem,
    lockers: HortenTable,
    selectedLocker: HortenItem,
    newLocker: HortenMold,
    importers: HortenTable,
    importings: HortenTable,
    lockers: HortenTable,
    bioimages: HortenTable,
}

export const lockersStavanger: ImportsStavanger = createStavanger({
    creator: createHortenItem({type: constants.USER, url: "users"}),
    lockers: createHortenTable(DEF_LOCKER),
    selectedLocker: createHortenItem(DEF_LOCKER),
    newLocker: createHortenMold({type:"newLocker",validator:null}),
    importers: createHortenTable({type: constants.IMPORTER, url: "importers"}),
    importings: createHortenTable({type: constants.IMPORTING, url: "importings"}),
    bioimages: createHortenTable(DEF_BIOIMAGE)
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
