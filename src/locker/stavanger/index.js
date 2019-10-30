import {createStavanger} from "../../alta/stavanger";
import type {HortenDetail} from "../../alta/horten/detail";
import {createHortenDetail} from "../../alta/horten/detail";
import * as constants from "../../constants"
import type {Stavanger} from "../../alta/stavanger";
import {createHortenList} from "../../alta/horten/list";
import type {HortenList} from "../../alta/horten/list";
import {createHortenTable} from "../../alta/horten/table";
import type {HortenTable} from "../../alta/horten/table";
import {createHortenItem} from "../../alta/horten/item";
import type {HortenItem} from "../../alta/horten/item";


export type LockerStavanger = Stavanger & {
    locker: HortenItem,
    selectedBioimage: HortenItem,
    bioimages: HortenTable,
    bioseries: HortenTable,
    bioimageflows: HortenTable,
    lockerflows: HortenTable,
    bioseriesflows: HortenTable,
}

export const lockerStavanger: LockerStavanger = createStavanger({
    locker: createHortenItem({type: constants.LOCKER, url: "lockers"}),
    selectedBioimage: createHortenItem({type: constants.BIOIMAGE, url:"bioimages"}),
    bioimages: createHortenTable({type: constants.BIOIMAGE, url: "bioimages"}),
    bioseries: createHortenTable({type: constants.BIOSERIES, url: "bioseries"}),
    bioimageflows: createHortenTable({type: constants.FLOW,url: "filterflows"}),
    lockerflows: createHortenTable({type: constants.FLOW,url: "filterflows"}),
    bioseriesflows: createHortenTable({type: constants.FLOW,url:"filterflows"}),
})

// You Should decide upfront if this is
// supposed to be a dynamically spawned container with a lot of instances - A Node
// Or if this is a generic Container that should be loaded upfront with an ALIAS that is always the same and can host NODES
