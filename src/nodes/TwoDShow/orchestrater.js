import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {TwoDShowStavanger} from "./index";
import * as constants from "../../constants";
import {createEdgeMaestro} from "../lib/meastros";
import {randomColor} from "randomcolor";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";


export const orchestraterEpic = (stavanger: TwoDShowStavanger) => {


    const onVectorsInPostRoi = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.canvas.model.postVectors.success),
            mergeMap(action => {
                let vectors = action.payload.vectors;
                let display = stavanger.display.selectors.getModel(state$.value)

                console.log("posting vectors and display",vectors, display)
                let roi = {
                    data: {
                        representation: display.data.representation,
                        vectors: JSON.stringify(action.payload.vectors),
                        creator: userIDPortal(state$.value),
                        display: display.data.id,
                        color: randomColor({luminosity: 'bright', format: 'rgb'}),
                        sample: display.data.sample,//is initial
                        experiment: display.data.experiment,
                        nodeid: stavanger.page.model.alias
                    },
                    meta:{
                        buffer: "None"
                    }

                }
                return [stavanger.rois.model.postItem.request(roi)]
            })
        );

    const onROIinForwardRoi = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.rois.model.osloItemCreate.success,
                    stavanger.rois.model.osloItemUpdate.success),
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

    const onDisplaySetShowOnCanvas = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.display.model.setItem.success),
            mergeMap(action => {
                let display = action.payload
                return [
                    stavanger.displayedDisplay.model.fetchItem.request(display),
                    stavanger.rois.model.fetchList.request({filter: {representation: display.data.representation}}),
                    stavanger.rois.model.osloJoin.request({meta: {room: {nodeid: stavanger.rois.model.alias}}}),
                    stavanger.edge.model.requireUser.request(true)
                ]
                }
            ));


    //Maestros

    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        apiConnector(stavanger.rois),
        itemConnector(stavanger.displayedDisplay)
    )

    return combineEpics(
        onDisplaySetShowOnCanvas,
        onVectorsInPostRoi,
        onROIinForwardRoi,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic