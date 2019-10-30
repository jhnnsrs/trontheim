import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {RoiIteratorStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector} from "../../rootMaestros";
import {selectionConductor} from "../../alta/conductor/selectionConductor";


export const orchestraterEpic = (stavanger: RoiIteratorStavanger) => {

    const cond = selectionConductor(stavanger, {
        output: "bioimages",
        filters: ["sample","experiment","representation","user","display","experimentalgroup"],
        filterFunc: (action$,state$) => {
            let sample = stavanger.sample.selectors.getData(state$.value)
            let representation = stavanger.representation.selectors.getData(state$.value)
            let experiment = stavanger.experiment.selectors.getData(state$.value)
            let user = stavanger.user.selectors.getData(state$.value)
            let display = stavanger.display.selectors.getData(state$.value)
            let experimentalgroup = stavanger.experimentalgroup.selectors.getData(state$.value)

            let filter = {
                sample: sample === null ? undefined : sample.id,
                creator: user === null ? undefined : user.id,
                representation: representation === null ? undefined : representation.id,
                experiment: experiment === null ? undefined : experiment.id,
                experimentalgroup: experimentalgroup === null ? undefined : experimentalgroup.id,
                display: display === null ? undefined : display.id,
            }


            return filter
        }
    })

    const onReceiveImpulsSentBioimageAndPopFromList = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.impuls.model.setItem.success),
            mergeMap(action => {
                let impuls = action.payload;

                let currentAvailabeItems = [...stavanger.rois.selectors.getList(state$.value)]
                console.log(currentAvailabeItems.length)
                let toBeSent = currentAvailabeItems.pop()
                console.log(currentAvailabeItems.length)


                let actionlist = []

                if (toBeSent) {
                    let roi = toBeSent;
                    let output = {
                        data: roi.data,
                        meta:{
                            model: stavanger.rois.definition.type,
                            nodeid: stavanger.rois.model.alias
                        }
                    }
                    actionlist.push(stavanger.edge.model.setOutput.request(output))
                    actionlist.push(stavanger.sentRois.model.addToList.request(toBeSent))
                    actionlist.push(stavanger.rois.model.setList.request([...currentAvailabeItems]))
                }
                else actionlist.push(stavanger.edge.model.requireUser.request(true))

                return actionlist
            })
        );



    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        apiConnector(stavanger.rois),
    )

    return combineEpics(cond,
        onReceiveImpulsSentBioimageAndPopFromList,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic