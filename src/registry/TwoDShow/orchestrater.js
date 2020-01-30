import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {TwoDShowStavanger} from "./index";
import {randomColor} from "randomcolor";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {nodeMaestro} from "../nodeMaestro";
import {DONE} from "../../constants/nodestatus";


export const orchestraterEpic = (stavanger: TwoDShowStavanger) => {

    const node = stavanger.node

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
                return [node.model.setOut("Roi").request(roi),
                    node.helpers.setStatus(DONE.outputSend, "Send away")]
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
                    stavanger.rois.model.osloJoin.request({meta: {room: {sample: display.data.sample}, singlealias: true}}),
                    stavanger.node.helpers.requireUser("Start marking Rois")
                ]
                }
            ));


    //Maestros

    const addin1 = nodeMaestro(stavanger, null)

    const apiConnections = combineEpics(
        apiConnector(stavanger.rois),
        itemConnector(stavanger.displayedDisplay)
    )

    return combineOrchestrator(stavanger, {
        onDisplaySetShowOnCanvas,
        onVectorsInPostRoi,
        onROIinForwardRoi,
        apiConnections,
        addin1
    })
}

export default orchestraterEpic