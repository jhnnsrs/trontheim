import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {RoiShowStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector, itemConnector} from "../../rootMaestros";
import type {RoiModel} from "../../types/models";


export const orchestraterEpic = (stavanger: RoiShowStavanger) => {



    const onRoiInFetchDisplayIfNeeded = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.roi.model.setItem.success),
            mergeMap(action => {
                let roi: RoiModel = stavanger.roi.selectors.getData(state$.value)
                let displayid = roi.display
                console.log(roi)
                if (displayid != stavanger.display.selectors.getID(state$.value)) {
                    console.log("Fetching new Display")
                    return [
                        stavanger.display.model.fetchItem.request({data: {id: displayid}}),
                        stavanger.rois.model.setList.request([roi]),
                        stavanger.edge.model.requireUser.request(true)
                    ]
                }
                else return [
                        stavanger.rois.model.setList.request([roi]),
                        stavanger.edge.model.requireUser.request(true)
                ]
                }
            ));


    //Maestros

    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        apiConnector(stavanger.rois),
        itemConnector(stavanger.display),
        itemConnector(stavanger.roi),
    )

    return combineEpics(
        onRoiInFetchDisplayIfNeeded,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic