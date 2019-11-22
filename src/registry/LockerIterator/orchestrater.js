import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {LockerIterator} from "./index";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {nodeMaestro} from "../nodeMaestro";
import {NODE} from "../../constants/nodestatus";


export const orchestraterEpic = (stavanger: LockerIterator) => {

    const onSampleIn = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.locker.model.setItem.success),
            mergeMap(action => {
                let sample = action.payload.data.id;
                return [stavanger.bioimages.model.fetchList.request({meta: {filter: {locker: sample}}}),
                    stavanger.bioimages.model.osloJoin.request({meta: {room: { locker: sample}}}),
                    stavanger.node.helpers.requireUser("Start Iterating!")]
            })
        );

    const onReceiveImpulsSentBioimageAndPopFromList = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.impuls.model.setItem.success),
            mergeMap(action => {
                let impuls = action.payload;

                let currentAvailableBioimages = [...stavanger.bioimages.selectors.getList(state$.value)]
                console.log(currentAvailableBioimages.length)
                let toBeSent = currentAvailableBioimages.pop()
                console.log(currentAvailableBioimages.length)


                let actionlist = []

                if (toBeSent) {
                    let bioimage = toBeSent;
                    let output = {
                        data: bioimage.data,

                    }
                    actionlist.push(stavanger.node.model.setOut("bioimage").request(output))
                    actionlist.push(stavanger.sentBioimages.model.addToList.request(toBeSent))
                    actionlist.push(stavanger.bioimages.model.setList.request([...currentAvailableBioimages]))
                }
                else actionlist.push(stavanger.node.helpers.setStatus(NODE.waitingForInput, "Wait for Bioimages"))

                return actionlist
            })
        );



    const moduleMaestro = nodeMaestro(stavanger)

    const apiConnections = combineEpics(
        apiConnector(stavanger.bioimages),
        apiConnector(stavanger.sentBioimages),
    )

    return combineOrchestrator(stavanger, {
        onSampleIn,
        onReceiveImpulsSentBioimageAndPopFromList,
        apiConnections,
        moduleMaestro
    })
}

export default orchestraterEpic