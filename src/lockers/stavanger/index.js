import {createStavanger} from "../../alta/stavanger";
import type {HortenDetail} from "../../alta/horten/detail";
import {createHortenDetail} from "../../alta/horten/detail";
import * as constants from "../../constants"
import type {Stavanger} from "../../alta/stavanger";
import {createHortenList} from "../../alta/horten/list";
import type {HortenList} from "../../alta/horten/list";
import {createHortenItem} from "../../alta/horten/item";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenTable} from "../../alta/horten/table";
import type {HortenItem} from "../../alta/horten/item";
import {createHortenForm} from "../../alta/horten/form";
import type {HortenForm} from "../../alta/horten/form";
import {createHortenMold} from "../../alta/horten/mold";


export type LockersStavanger = Stavanger & {
    creator: HortenItem,
    selectedLocker: HortenItem,
    bioimages: HortenTable,
    newLocker: HortenForm,
    lockers: HortenTable,
}

export const lockersStavanger: LockersStavanger = createStavanger({
    creator: createHortenItem({type: constants.USER, url: "users"}),
    selectedLocker: createHortenItem({type: constants.LOCKER, url: "lockers"}),
    newLocker: createHortenMold({type:"newLocker",validator:null}),
    lockers: createHortenTable({type: constants.LOCKER, url: "lockers"}),
    bioimages: createHortenTable({type: constants.BIOIMAGE, url: "bioimages"}),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
