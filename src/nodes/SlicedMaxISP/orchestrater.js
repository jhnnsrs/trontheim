import {combineEpics, ofType} from "redux-observable";
import {filter, mergeMap} from "rxjs/operators";
import type {SlicedMaxISPStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";


export const orchestraterEpic = (stavanger: SlicedMaxISPStavanger) => {

    const onRoiInPostTransformation = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.representation.model.setItem.success),
            mergeMap(action => {
                let representation = action.payload;
                let settings = stavanger.settings.selectors.getMerged(state$.value)
                let edge = stavanger.edge.selectors.getModel(state$.value)

                let filtering = {
                    data: {
                        settings: JSON.stringify(settings),
                        creator: userIDPortal(state$.value),
                        filter: edge.entityid,
                        experiment: representation.data.experiment,
                        sample: representation.data.sample,
                        representation: representation.data.id,
                        nodeid: edge.nodeid
                    },
                    meta:{
                        buffer: "None"
                    }


                }

                console.log("posting filtering", filtering)
                return [stavanger.filterings.model.postItem.request(filtering),
                    stavanger.edge.model.setProgress.request(1)]
            })
        );

    const onSliceInUpdateSettings = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.slice.model.setItem.success),
            mergeMap(action => {
                let slice = action.payload.data;
                console.log("Setting slice", slice)
                return [stavanger.settings.model.setInitial.request(slice)]
            })
        );

    const onPageStartedListenToTransformation = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.request),
            mergeMap(action => {
                    return [stavanger.representations.model.osloJoin.request({meta: {room: {nodeid: stavanger.representations.model.alias}}})]
                }
            ));

    const onTransformationInForwardTransformation = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.representations.model.osloItemCreate.success,
                stavanger.representations.model.osloItemUpdate.success),
            filter(action => action.payload.data.nodeid === stavanger.representations.model.alias),
            mergeMap(action => {
                console.log("called")
                let representation = action.payload;
                let output = {
                    data: representation.data,
                    meta:{
                        model: constants.REPRESENTATION,
                        nodeid: stavanger.representations.model.alias
                    }

                }
                return [stavanger.edge.model.setOutput.request(output),
                    stavanger.edge.model.setProgress.request(0)]
            })
        );

    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        itemConnector(stavanger.representation),
        apiConnector(stavanger.representations),
        apiConnector(stavanger.filterings)
    )

    return combineEpics(onRoiInPostTransformation,
        onTransformationInForwardTransformation,
        onPageStartedListenToTransformation,
        apiConnections,
        onSliceInUpdateSettings,
        moduleMaestro)
}

export default orchestraterEpic