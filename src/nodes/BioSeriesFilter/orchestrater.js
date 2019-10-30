
import {combineEpics, ofType} from "redux-observable";
import type {DisplayNodeStavanger, BioSeriesCollectorStavanger} from "./index";
import {createEdgeMaestro, createModuleMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {audit, filter, map, mergeMap, switchMap, take} from "rxjs/operators";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {watcherConductor} from "../../alta/conductor/watcherconductor";
import {collectorConductor} from "../../alta/conductor/collectorconductor";
import {userIDPortal} from "../../portals";
import {filters} from "./availableFilters";


export const orchestraterEpic = (stavanger: BioSeriesCollectorStavanger) => {


    const moduleMaestro = createEdgeMaestro(stavanger)

    const onReceiveBioSeriesFilter = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.bioseries.model.setItem.success),
            mergeMap(action => {

                let settings = stavanger.settings.selectors.getMerged(state$.value)

                let bioseries = action.payload
                console.log("Settings",settings)
                if (!settings.filter || !settings.stringfield ) return [stavanger.edge.model.requireUser.request("Please First Choose Filter")]
                let filterfunc = filters[settings.filter].filterFunc

                let filteredItem = filterfunc([bioseries],settings)
                console.log(filteredItem)

                let actionlist = []

                if (filteredItem) {
                    let bioseries = filteredItem;
                    let output = {
                        data: bioseries.data,
                        meta:{
                            model: constants.BIOSERIES,
                            nodeid: stavanger.bioseries.model.alias
                        }
                    }
                    actionlist.push(stavanger.edge.model.setOutput.request(output))
                }
                else actionlist.push(stavanger.edge.model.requireUser.request(true))

                return actionlist
            })
        );


    const apiConnections = combineEpics(
        itemConnector(stavanger.bioseries),
    )

    return combineEpics(
        apiConnections,
        onReceiveBioSeriesFilter,
        moduleMaestro)
}

export default orchestraterEpic