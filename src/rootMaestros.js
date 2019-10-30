import {combineEpics} from "redux-observable";
import {rootStavanger} from "./rootStavanger";
import {tableRestAPIMaestro} from "./alta/maestro/table-restapi";
import {itemRestAPIMaestro} from "./alta/maestro/item-restapi";
import {tableOsloMaestro} from "./alta/maestro/table-oslo";
import {itemOsloMaestro} from "./alta/maestro/item-oslo";


export const apiConnector = (list) => combineEpics(tableRestAPIMaestro(rootStavanger.api)(list),tableOsloMaestro(rootStavanger.oslo)(list))
export const itemConnector = (list) =>combineEpics(itemRestAPIMaestro(rootStavanger.api)(list),itemOsloMaestro(rootStavanger.oslo)(list))


// Selectors, they should vanish
export const userSelector = (state) => state.root.user.currentUser.id
export const osloconfigSelector = (state) =>  state.profiles.oslo.config