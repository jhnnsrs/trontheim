import {combineEpics, ofType} from "redux-observable";
import type {BioSeriesFilter} from "./index";
import {apiConnector} from "../../rootMaestros";
import {nodeMaestro} from "../nodeMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {mergeMap} from "rxjs/operators";
import {filters} from "../../nodes/BioSeriesFilter/availableFilters";
import * as constants from "../../constants";


export const orchestraterEpic = (stavanger: BioSeriesFilter) => {


    const addin =  nodeMaestro(stavanger, null)

    const onReceiveBioSeriesFilter = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.bioseriesin.model.setItem.success),
            mergeMap(action => {

                let settings = stavanger.settings.selectors.getMerged(state$.value)

                let bioseries = action.payload
                stavanger.settings.helpers.log("Settings",settings)
                if (!settings.filter || !settings.stringfield ) return [stavanger.node.helpers.requireUser("Please Choose Filter first")]
                let filterfunc = filters[settings.filter].filterFunc

                let filteredItem = filterfunc([bioseries],settings)
                stavanger.settings.helpers.log("Filtered item",filteredItem)


                if (filteredItem) {
                    let bioseries = filteredItem;
                    let output = {
                        data: bioseries.data,
                        meta:{
                            model: constants.BIOSERIES,
                            nodeid: stavanger.bioseries.model.alias
                        }
                    }
                    return [stavanger.node.model.setOut("bioseries").request(output)]
                }
                return [stavanger.node.helpers.requireUser("Item didnt Match filter")]

            })
        );





    const apiConnections = combineEpics(
        apiConnector(stavanger.bioseries)
    )

    return combineOrchestrator(stavanger, {
            apiConnections,
            addin,
            onReceiveBioSeriesFilter
        }
    )
}

export default orchestraterEpic