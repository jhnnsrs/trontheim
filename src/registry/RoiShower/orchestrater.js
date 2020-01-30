import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {RoiShowerStavanger} from "./index";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {nodeMaestro} from "../nodeMaestro";


export const orchestraterEpic = (stavanger: RoiShowerStavanger) => {

    const node = stavanger.node

    const onRoiInFetchDisplayIfNeeded = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.roi.model.setItem.success),
            mergeMap(action => {
                    let roi = stavanger.roi.selectors.getData(state$.value)
                    let displayid = roi.display
                    if (displayid !== stavanger.display.selectors.getID(state$.value)) {
                        console.log("Fetching new Display")
                        return [
                            stavanger.displayedDisplay.model.fetchItem.request({data: {id: displayid}}),
                            stavanger.rois.model.setList.request([roi]),
                            stavanger.node.helpers.requireUser("Roi Updated and Display updated")
                        ]
                    }
                    else return [
                        stavanger.rois.model.setList.request([roi]),
                        stavanger.node.helpers.requireUser("Roi Updated")
                    ]
                }
            ));


    const onDisplaySetShowOnCanvas = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.display.model.setItem.success),
            mergeMap(action => {
                let display = action.payload
                return [
                    stavanger.displayedDisplay.model.fetchItem.request(display),
                    stavanger.rois.model.fetchList.request({filter: {representation: display.data.representation}}),
                    stavanger.rois.model.osloJoin.request({meta: {room: {nodeid: stavanger.rois.model.alias}}}),
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
        onRoiInFetchDisplayIfNeeded,
        apiConnections,
        addin1
    })
}

export default orchestraterEpic