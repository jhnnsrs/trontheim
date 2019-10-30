import {combineEpics, ofType} from "redux-observable";
import {map, mergeMap, combineLatest} from "rxjs/operators";
import type {LockersStavanger} from "../stavanger";
import {apiConnector, itemConnector, userSelector} from "../../rootMaestros";

export const orchestraterEpic = (stavanger: LockersStavanger) => {

    const onPageInitLoadLockers = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let creatorid = action.payload.match.params.creatorid
                return [
                    stavanger.creator.model.fetchItem.request({data: { id: creatorid}}),
                    stavanger.lockers.model.fetchList.request({filter: {creator: creatorid}}),
                    stavanger.lockers.model.osloJoin.request({meta: {room: {creator: creatorid}}}),
                ]
            }));


    const onLockerSelect= (action$, state$) =>
        action$.pipe(
            ofType(stavanger.lockers.model.selectItem.success),
            mergeMap(action => {
                return [ stavanger.selectedLocker.model.setItem.request(action.payload),
                stavanger.bioimages.model.fetchList.request({filter: { locker: action.payload.data.id}})]
            }));

    const onLockerPostSuccess= (action$, state$) =>
        action$.pipe(
            ofType(stavanger.lockers.model.postItem.success),
            mergeMap(action => {
                return [ stavanger.page.model.setProp.request({ key: "modalOpen", value: false}),]
            }));

    const onLockerFormPost= (action$, state$) =>
        action$.pipe(
            ofType(stavanger.newLocker.model.submitForm.success),
            mergeMap(action => {
                let data = action.payload

                let locker = {
                    data: {
                        creator: userSelector(state$.value),
                        name: data.name,
                        location: data.location,
                    },
                    meta: {
                        new: true
                    }
                }

                return [
                    stavanger.lockers.model.postItem.request(locker),
                    stavanger.page.model.setProp.request({key: "modalOpen", value: false})]
            }));


    const apiConnections = combineEpics(
        itemConnector(stavanger.creator),
        apiConnector(stavanger.lockers),
        apiConnector(stavanger.bioimages),
    )


    return combineEpics(
        onPageInitLoadLockers,
        onLockerSelect,
        onLockerPostSuccess,
        onLockerFormPost,
        apiConnections
        )
}

export default orchestraterEpic