import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {RoiSelectorStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";


export const orchestraterEpic = (stavanger: RoiSelectorStavanger) => {

    const onSampleIn = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.sample.model.setItem.success),
            mergeMap(action => {
                let sample = action.payload.data.id;
                return [stavanger.rois.model.fetchList.request({meta: {filter: {sample: sample}}}),
                stavanger.rois.model.osloJoin.request({meta: {room: { sample: sample}}}),
                stavanger.edge.model.requireUser.request(true)]
            })
        );


    const onRoiSelected = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.rois.model.selectItem.request),
            mergeMap(action => {
                let roi = action.payload;
                let output = {
                    data: roi.data,
                    meta:{
                        model: constants.ROI,
                        nodeid: stavanger.rois.model.alias
                    }

                }
                return [stavanger.edge.model.setOutput.request(output),
                    stavanger.edge.model.requireUser.request(false)]
            })
        );



    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        itemConnector(stavanger.sample),
        apiConnector(stavanger.rois)
    )

    return combineEpics(onSampleIn,
        onRoiSelected,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic