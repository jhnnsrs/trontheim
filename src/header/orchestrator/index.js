import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HeaderStavanger} from "../stavanger";
import {rootStavanger} from "../../rootStavanger";
import {OPEN_OSLO_MODAL} from "../../constants/portals";

export const orchestraterEpic = (stavanger: HeaderStavanger) => {

    let apiModel = rootStavanger.api.model
    let osloModel = rootStavanger.oslo.model
    let oslo = rootStavanger.oslo
    let userModel = rootStavanger.user.model
    let httpModel = rootStavanger.http.model
    let portal = rootStavanger.portal

    const onLoginSetApiPoint = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let token = window.localStorage.getItem("tokenit");
                let osloconfig = window.localStorage.getItem("osloconfig")
                let config = osloconfig ? JSON.parse(osloconfig): null

                let modalOpenAction = stavanger.page.model.setProp.request({key: "modalOpen", value: true})
                oslo.helpers.log(modalOpenAction)
                if (token!= null & config != null) {

                    oslo.helpers.log("Connected to Oslo '" + config.name+ "' at '" + config.rooturl)
                    return [
                        portal.model.setPortal.request({id: "OSLO_MODAL_OPEN", action:  modalOpenAction}),
                        apiModel.setAuth.request({token: token, rooturl: config.rooturl}),
                        osloModel.setAuth.request({token: token, websocket: config.websocket}),
                        httpModel.setAuth.request({token: token, rooturl: config.rooturl}),
                        userModel.getUserForToken.request({token: token, rooturl: config.rooturl})
                    ]
                }
                else return [
                    portal.model.setPortal.request({id: OPEN_OSLO_MODAL, action:  modalOpenAction}),
                    stavanger.page.model.dynamic("LOGIN_REQUIRED").success("Uh Have to login first darling"),]
            })
        );

    const onOsloConnectionLost = (action$, state$) =>
        action$.pipe(
            ofType(osloModel.connectionLost.request),
            mergeMap(action => {
                return [
                        stavanger.oauth.model.requestLogin.request()
                    ]
            })
        );

    const onPageInitSetAvailable = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.oauth.model.login.success),
            mergeMap(action => {
                console.log(action.payload)

                let token = action.payload.token
                let config = stavanger.oauth.selectors.getCurrentEndpoint(state$.value)

                window.localStorage.setItem("tokenit", token);
                window.localStorage.setItem("osloconfig",JSON.stringify(config));

                return [
                    apiModel.setAuth.request({token: token, rooturl: config.rooturl}),
                    httpModel.setAuth.request({token: token, rooturl: config.rooturl}),
                    osloModel.setAuth.request({token: token, websocket: config.websocket}),
                    userModel.getUserForToken.request({token: token, rooturl: config.rooturl})

                ]
            }));

    const onLogoutUnsetEverything = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.oauth.model.logout.success),
            mergeMap(action => {

                window.localStorage.setItem("tokenit", null);
                window.localStorage.setItem("osloconfig",null);

                return [
                    apiModel.reset.request({}),
                    httpModel.reset.request({}),
                    osloModel.reset.request({}),
                    userModel.reset.request({})

                ]
            }));



    return combineEpics(onPageInitSetAvailable,onLoginSetApiPoint,onOsloConnectionLost,onLogoutUnsetEverything)
}

export default orchestraterEpic