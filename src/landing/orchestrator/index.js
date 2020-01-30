import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {LandingStavanger} from "../stavanger";
import rootStavanger from "../../rootStavanger";
import {OPEN_OSLO_MODAL} from "../../constants/portals";

export const orchestraterEpic = (stavanger: LandingStavanger) => {

    const onPageInit = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.request),
            mergeMap(action => {
                return [stavanger.page.model.initPage.success()]
            }));

    const onRequestOsloModel = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.dynamic("REQUEST_OSLO_MODAL").request),
            mergeMap(action => {

                let openModelAction = rootStavanger.portal.selectors.getPortal(OPEN_OSLO_MODAL)(state$.value)
                return [openModelAction]
            }));




    const apiConnections = combineEpics()


    return combineEpics(
        onPageInit,
        onRequestOsloModel,
        apiConnections
    )
}

export default orchestraterEpic