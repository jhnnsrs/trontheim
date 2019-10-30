import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {ExhibitShowStavanger} from "./index";
import * as constants from "../../constants";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector, itemConnector} from "../../rootMaestros";


export const orchestraterEpic = (stavanger: ExhibitShowStavanger) => {


    const onVectorsInPostRoi = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.cube.model.postSlice.success),
            mergeMap(action => {
                let slice = action.payload;
                let output = {
                    data: slice.data,
                    meta:{
                        model: constants.SLICE,
                        nodeid: stavanger.cube.model.alias
                    }

                }

                return [stavanger.edge.model.setOutput.request(output),
                    stavanger.edge.model.requireUser.request(false)]
            })
        );


    const onDisplaySetShowOnCanvas = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.exhibitin.model.setItem.success),
            mergeMap(action => {
                let exhibit = action.payload
                // TODO: FIX: We need to fetch the exhibit new now because the serializer does return only a relative path and the webfront the real niftipath
                return [
                    stavanger.exhibit.model.fetchItem.request({data: { id: exhibit.data.id}}),
                    stavanger.rois.model.fetchList.request({filter: {representation: exhibit.data.representation}}),
                    stavanger.rois.model.osloJoin.request({meta: {room: {nodeid: stavanger.rois.model.alias}}}),
                    stavanger.edge.model.requireUser.request(true)
                ]
                }
            ));


    //Maestros

    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        apiConnector(stavanger.rois),
        itemConnector(stavanger.exhibit)
    )

    return combineEpics(
        onDisplaySetShowOnCanvas,
        onVectorsInPostRoi,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic