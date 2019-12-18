import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HeaderStavanger} from "../stavanger";
import {rootStavanger} from "../../rootStavanger";
import {osloEndpoints} from "../../constants/endpoints";

export const orchestraterEpic = (stavanger: HeaderStavanger) => {

    let apiModel = rootStavanger.api.model
    let osloModel = rootStavanger.oslo.model
    let userModel = rootStavanger.user.model
    let httpModel = rootStavanger.http.model

    const onLoginSetApiPoint = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.request),
            mergeMap(action => {
                let token = window.localStorage.getItem("oslotoken");
                let config = JSON.parse(window.localStorage.getItem("osloconfig"));
                if (token!= null & config != null) {
                    return [
                        apiModel.setAuth.request({token: token, rooturl: config.rooturl}),
                        osloModel.setAuth.request({token: token, websocket: config.websocket}),
                        httpModel.setAuth.request({token: token, rooturl: config.rooturl}),
                        userModel.getUserForToken.request({token: token, rooturl: config.rooturl})
                    ]
                }
                else return [
                    stavanger.page.model.initPage.success("Uh Have to login first darling"),]
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
                window.localStorage.setItem("oslotoken", token);
                window.localStorage.setItem("osloconfig",JSON.stringify(config));

                return [
                    apiModel.setAuth.request({token: token, rooturl: config.rooturl}),
                    httpModel.setAuth.request({token: token, rooturl: config.rooturl}),
                    osloModel.setAuth.request({token: token, websocket: config.websocket}),
                    userModel.getUserForToken.request({token: token, rooturl: config.rooturl})

                ]
            }));



    return combineEpics(onPageInitSetAvailable,onLoginSetApiPoint,onOsloConnectionLost)
}

export default orchestraterEpic