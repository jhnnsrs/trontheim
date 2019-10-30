import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {RepresentationSelectorStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";


export const orchestraterEpic = (stavanger: RepresentationSelectorStavanger) => {

    const onSampleIn = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.sample.model.setItem.success),
            mergeMap(action => {
                let sample = action.payload.data.id;
                return [stavanger.representations.model.fetchList.request({meta: {filter: {sample: sample}}}),
                stavanger.representations.model.osloJoin.request({meta: {room: { sample: sample}}}),
                stavanger.edge.model.requireUser.request(true)]
            })
        );


    const onRepresentationSelected = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.representations.model.selectItem.request),
            mergeMap(action => {
                let representation = action.payload;
                let output = {
                    data: representation.data,
                    meta:{
                        model: constants.REPRESENTATION,
                        nodeid: stavanger.representations.model.alias
                    }

                }
                return [stavanger.edge.model.setOutput.request(output),
                    stavanger.edge.model.requireUser.request(false)]
            })
        );



    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        itemConnector(stavanger.sample),
        apiConnector(stavanger.representations)
    )

    return combineEpics(onSampleIn,
        onRepresentationSelected,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic