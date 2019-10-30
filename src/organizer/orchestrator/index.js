import {combineEpics, ofType} from "redux-observable";
import {map, mergeMap, combineLatest} from "rxjs/operators";
import type {OrganizerStavanger} from "../stavanger";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";

export const orchestraterEpic = (stavanger: OrganizerStavanger) => {

    const onPageInitLoadExperimentAndSamples = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let experimentid = action.payload.match.params.experimentid
                return [
                    stavanger.experiment.model.fetchItem.request({data: {id: experimentid}}),
                    stavanger.samples.model.fetchList.request({}),
                    stavanger.samples.model.osloJoin.request({meta: {room: {experiment: experimentid}}}),
                ]
            }));


    const onMoveIndicesRequest = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.draggable.model.moveIndices.request),
            mergeMap(action => {
                const source = action.payload.source.droppableId
                const destination = action.payload.destination.droppableId

                // GET LISTS
                const sourcelist = stavanger[source].selectors.getList(state$.value)
                const destinationlist = stavanger[destination].selectors.getList(state$.value)
                const selectedItemIDs = stavanger.draggable.selectors.getSelected(state$.value)

                // REMOVE ITEMS FROM LIST
                const newsourcelist = sourcelist.filter(item => !selectedItemIDs.includes(item.data.id))
                const toAddList = sourcelist.filter(item => selectedItemIDs.includes(item.data.id))

                // ADD TO SOURCE LIST
                const newdestinationlist = [...destinationlist, ...toAddList]


                return [
                    stavanger[source].model.setList.request(newsourcelist),
                    stavanger[destination].model.setList.request(newdestinationlist),
                    stavanger.draggable.model.moveIndices.success({}),
                ]
            }));


    const onSampleSelectedSetSelectedSample = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.samples.model.selectItem.success),
            mergeMap(action => {
                return [ stavanger.selectedSample.model.setItem.request(action.payload)]
            }));


    const apiConnections = combineEpics(
        itemConnector(stavanger.experiment),
        apiConnector(stavanger.samples),
    )

    return combineEpics(onPageInitLoadExperimentAndSamples,onSampleSelectedSetSelectedSample,apiConnections,onMoveIndicesRequest)
}

export default orchestraterEpic