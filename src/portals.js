import {rootStavanger} from "./rootStavanger";


// Portals, they should vanish
export const userPortal = rootStavanger.user.selectors.getUser
export const userIDPortal = rootStavanger.user.selectors.getID
export const hasUserPortal = rootStavanger.user.selectors.hasUser