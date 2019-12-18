import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {NodeBuilderStavanger} from "../stavanger";
import {apiConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";

export const orchestraterEpic = (stavanger: NodeBuilderStavanger) => {

    const onPageInitLoadNodeBuilderUtils = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                return [
                    stavanger.arnheimhosts.model.fetchList.request({}),
                    stavanger.nodes.model.fetchList.request({filter: {creator: 1}}),
                    stavanger.nodes.model.osloJoin.request({meta: {room: {creator: 1}}}),
                ]
            }));

    const onArnHeimSelectedLoadVarieties = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.arnheimhosts.model.selectItem.request),
            mergeMap(action => {
                let arnheimhost = action.payload.data
                return [
                    stavanger.varieties.model.fetchList.request({filter: {host: arnheimhost.id}}),
                ]
            }));

    const onVarietiesSelectedLoadEntities = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.varieties.model.selectItem.request),
            mergeMap(action => {
                let variety = action.payload.data

                console.log(variety)

                let meta = {
                    rooturl: variety.rooturl,
                    suburl: variety.url
                }

                return [
                    stavanger.entities.model.fetchList.request({meta: meta}),
                ]
            }));

    const onEntitySelectedLoadInitialSettings = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.entities.model.selectItem.request),
            mergeMap(action => {
                let {data, meta} = action.payload

                let entity = {...data, defaultsettings: JSON.parse(data.defaultsettings)}
                return [
                    stavanger.selectedEntity.model.setItem.request({data: entity, meta: meta}),
                    stavanger.nodeform.model.setInitial.request(entity),
                ]
            }));

    const onNodeFormSubmitPostNode = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.nodeform.model.submitForm.success),
            mergeMap(action => {
                let values = {
                    ...action.payload,
                    creator: userIDPortal(state$.value),
                    defaultsettings: JSON.stringify(action.payload.defaultsettings),
                    variety: stavanger.varieties.selectors.getSelected(state$.value).data.id,
                    entityid: action.payload.id,
                }

                console.log(values)
                return [
                    stavanger.nodes.model.postItem.request({data: values, meta: ""}),

                ]
            }));


    let entitiesConnection = apiConnector(stavanger.entities)
    let nodesConnection = apiConnector(stavanger.nodes)
    let varietiesConnection = apiConnector(stavanger.varieties)


    return combineEpics(
        onPageInitLoadNodeBuilderUtils,
        onArnHeimSelectedLoadVarieties,
        onVarietiesSelectedLoadEntities,
        onEntitySelectedLoadInitialSettings,
        onNodeFormSubmitPostNode,
        nodesConnection,
        varietiesConnection,
        entitiesConnection)
}

export default orchestraterEpic