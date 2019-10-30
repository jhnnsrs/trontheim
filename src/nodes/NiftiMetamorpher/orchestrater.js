import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {BioConverterStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";


export const orchestraterEpic = (stavanger: BioConverterStavanger) => {

    const onBioSeriesInPostsConversing = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.representation.model.setItem.success),
            mergeMap(action => {
                let representation = action.payload;
                let settings = stavanger.settings.selectors.getMerged(state$.value)
                let node = stavanger.edge.selectors.getModel(state$.value)

                let metamorphing = {
                    data: {
                        settings: JSON.stringify(settings),
                        creator: userIDPortal(state$.value),
                        representation: representation.data.id,//is initial
                        sample: representation.data.sample,//is initial
                        metamorpher: node.entityid,
                        nodeid: node.nodeid,
                        override: false
                    },
                    meta:{
                        buffer: "of course"
                    }


                }

                console.log("posting metamorphings", metamorphing)
                return [stavanger.metamorphings.model.postItem.request(metamorphing),
                stavanger.edge.model.setProgress.request(1)]
            })
        );

    const onPageStartedListenToSamples = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.request),
            mergeMap(action => {
                    return [stavanger.exhibits.model.osloJoin.request({meta: {room: {nodeid: stavanger.exhibits.model.alias}}})]
                }
            ));

    const onSampleInForwardSample = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.exhibits.model.osloItemCreate.success,
                stavanger.exhibits.model.osloItemUpdate.success),
            mergeMap(action => {
                let display = action.payload;
                let output = {
                    data: display.data,
                    meta:{
                        model: constants.EXHIBIT,
                        nodeid: stavanger.exhibits.model.alias
                    }

                }
                return [stavanger.edge.model.setOutput.request(output),
                    stavanger.edge.model.setProgress.request(0)]
            })
        );



    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        itemConnector(stavanger.representation),
        apiConnector(stavanger.metamorphings),
        apiConnector(stavanger.exhibits)
    )


    return combineEpics(onBioSeriesInPostsConversing,
        onSampleInForwardSample,
        onPageStartedListenToSamples,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic