import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {RepresentationStavanger} from "../stavanger";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";

export const orchestraterEpic = (stavanger: RepresentationStavanger) => {

    let unique = "oisndofinseoifnosinfsef"

    const onPageInitLoadSampleRepresentationsAndDisplays = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let representationid = action.payload.match.params.representationid
                return [
                    stavanger.representation.model.fetchItem.request({data: {id: representationid}}),
                    stavanger.displays.model.fetchList.request({meta: {filter: {representation: representationid}}}),
                    stavanger.exhibits.model.fetchList.request({meta: {filter: {representation: representationid}}}),
                    stavanger.metamorphers.model.fetchList.request({meta: {}}),
                    stavanger.metamorphings.model.osloJoin.request({meta: {room: {nodeid: unique}}}),
                    stavanger.exhibits.model.osloJoin.request({meta: {room: {nodeid: unique}}}),
                    stavanger.displays.model.osloJoin.request({meta: {room: {nodeid: unique}}}),
                    stavanger.rois.model.fetchList.request({meta: {filter: {representation: representationid}}}),
                    stavanger.rois.model.osloJoin.request({meta: {room: {representation: representationid}}}),
                    stavanger.displayflows.model.fetchList.request({meta: {filter: {type: constants.FLOWTYPES.DISPLAY}}}),
                    stavanger.roiflows.model.fetchList.request({meta: {filter: {type: constants.FLOWTYPES.ROI}}}),
                ]
            }));

    const onDemandMetamorphing = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.dynamic("METAMORPH").request),
            mergeMap(action => {
                let metamorpher = action.payload.metamorpher.data
                let representation = action.payload.representation

                let metamorphings = {
                    data: {
                        creator: userIDPortal(state$.value),
                        override: true,
                        settings: JSON.stringify({normalize: true}),
                        metamorpher: metamorpher.id,
                        representation: representation.id,
                        nodeid: unique,
                    },
                    meta: {
                        new: true
                    }
                }

                return [stavanger.metamorphings.model.postItem.request(metamorphings),]
            }));




    const apiConnections = combineEpics(
        apiConnector(stavanger.displays),
        apiConnector(stavanger.rois),
        apiConnector(stavanger.displayflows),
        apiConnector(stavanger.roiflows),
        apiConnector(stavanger.exhibits),
        apiConnector(stavanger.metamorphers),
        apiConnector(stavanger.metamorphings),
        itemConnector(stavanger.representation)
    )


    return combineEpics(
        onPageInitLoadSampleRepresentationsAndDisplays,
        onDemandMetamorphing,
        apiConnections
        )
}

export default orchestraterEpic