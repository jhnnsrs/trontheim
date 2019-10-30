
import {combineEpics, ofType} from "redux-observable";
import type {DisplayNodeStavanger, SampleWatcherStavanger} from "./index";
import {createEdgeMaestro, createModuleMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {audit, filter, map, mergeMap, switchMap, take} from "rxjs/operators";
import {apiConnector, itemConnector} from "../../rootMaestros";


export const orchestraterEpic = (stavanger: SampleWatcherStavanger) => {


    const onDataInForwardData = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.sample.model.setItem.success),
            switchMap((action) =>
                action$.pipe(
                    ofType(stavanger.edge.model.dynamic("START").request),
                    take(1),
                    mergeMap(() => {
                            let bioimage = action.payload;
                            console.log("data forward")
                            let output = {
                                data: bioimage.data,
                                meta: {
                                    model: constants.SAMPLE,
                                    nodeid: stavanger.sample.model.alias
                                }

                            }
                            return [stavanger.edge.model.setOutput.request(output)]
                        }
                    )
                )
            )
        );

    const onSelectRandomFetchList = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.edge.model.dynamic("START_RANDOM").request),
            mergeMap(action => {
                return [stavanger.samples.model.fetchList.request({filter: {creator: 1}}),
                        stavanger.edge.model.setProgress.request(1)]
            })
        );

    const onFetchListSendSamle = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.samples.model.fetchList.success),
            mergeMap(action => {
                let sample = action.payload.data[0]
                let output = {
                    data: sample,
                    meta: {
                        model: constants.SAMPLE,
                        nodeid: stavanger.sample.model.alias
                    }

                }
                return [stavanger.edge.model.setOutput.request(output),
                stavanger.edge.model.setProgress.request(0)]
            })
        );



    const moduleMaestro = createEdgeMaestro(stavanger)


    const apiConnections = combineEpics(
        itemConnector(stavanger.sample),
        apiConnector(stavanger.samples)
    )

    return combineEpics(
        onDataInForwardData,
        onSelectRandomFetchList,
        onFetchListSendSamle,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic