import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {ExhibitSelectorStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import * as constants from "../../constants";
import {apiConnector, itemConnector} from "../../rootMaestros";


export const orchestraterEpic = (stavanger: ExhibitSelectorStavanger) => {

    const onSampleIn = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.locker.model.setItem.success),
            mergeMap(action => {
                let sample = action.payload.data.id;
                return [stavanger.bioimages.model.fetchList.request({meta: {filter: {locker: sample}}}),
                stavanger.bioimages.model.osloJoin.request({meta: {room: { locker: sample}}}),
                stavanger.edge.model.requireUser.request(true)]
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
                        meta:{
                            model: constants.BIOIMAGE,
                            nodeid: stavanger.bioimages.model.alias
                        }
                    }
                    actionlist.push(stavanger.edge.model.setOutput.request(output))
                    actionlist.push(stavanger.sentBioimages.model.addToList.request(toBeSent))
                    actionlist.push(stavanger.bioimages.model.setList.request([...currentAvailableBioimages]))
                }
                else actionlist.push(stavanger.edge.model.requireUser.request(true))

                return actionlist
            })
        );



    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        itemConnector(stavanger.locker),
        apiConnector(stavanger.bioimages),
        apiConnector(stavanger.sentBioimages),
    )

    return combineEpics(onSampleIn,
        onReceiveImpulsSentBioimageAndPopFromList,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic