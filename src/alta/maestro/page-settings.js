import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HortenPage} from "../horten/page";
import type {HortenForm} from "../horten/form";

export interface SettingsStavanger {
    settings: HortenForm
}

export interface PageStavanger {
    page: HortenPage,
    settings: HortenForm,
}

export const pageSettingsMaestro = (pageStavanger: PageStavanger, settingsStavanger: PageStavanger): Epic  => {

    // This allows for
    let settings = settingsStavanger ? settingsStavanger.settings : pageStavanger.settings
    let page = pageStavanger.page

    //TODO: Set Node Output to FlowDiagram
    const onPageStartedRegisterSettings = (action$, state$) =>
        action$.pipe(
            ofType(page.model.initPage.request),
            mergeMap(action => {
                    return [settings.model.setInitial.request(action.payload.node.defaultsettings),]
                }
            ));






    return combineEpics(onPageStartedRegisterSettings)
}
