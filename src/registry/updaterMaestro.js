import {ActionsObservable, combineEpics, ofType, StateObservable} from "redux-observable";
import {filter, mergeMap} from "rxjs/operators";
import {buildStatus, WAITING} from "../constants/nodestatus";
import type {HortenItem} from "../alta/horten/item";
import {Action} from "redux";
import type {HortenPage} from "../alta/horten/page";
import type {HortenEdge} from "../alta/horten/edge";
import type {HortenMold} from "../alta/horten/mold";
import type {HortenValue} from "../alta/horten/value";
import type {NodeStavanger} from "./lib/types";


export interface NodeUpdaterDefinition {
    updaters: [string],
    output:string,
    updateFunc: Epic,
    filters: [string],
    filterActions: ([Action], ActionsObservable, StateObservable) => any
}


export const updaterMaestro = (stavanger: NodeStavanger, definition: NodeUpdaterDefinition) => {

    let edge: HortenEdge = stavanger.node
    let page: HortenPage = stavanger.page
    let settings: HortenMold = stavanger.settings

    let output: HortenItem =  stavanger[definition.output]
    let updaters: [HortenValue] = definition.updaters.map( item => stavanger[item] ? stavanger[item] : null).filter(item => item != null)
    let updateFunc = definition.updateFunc

    const getInputsOrNull = (state$) => {
        let links = edge.selectors.getLinks(state$.value)
        console.log(output.definition.type,links)
        let ins = edge.definition.ins

        let checkAbleInputs = links.flatMap(link => ins.filter(map => {
            return link.targetPort.startsWith(map.in.toUpperCase() + "_IN") || link.targetPort.startsWith("*")
        }).map(map => map.map))

        return checkAbleInputs
    }

    const onPageStartedListenToOutput = (action$, state$) =>
        action$.pipe(
            ofType(page.model.initPage.success),
            mergeMap(action => {
                    return [output.model.osloJoin.request({meta: {room: {nodeid: output.model.alias}}}), edge.model.fetchLinks.request()]
                }
            ));


    const onModelInAskForWhatBuilder = (updaters) =>(action$, state$) =>
        action$.pipe(
            ofType(updaters.model.setItem.success),
            mergeMap(action => {

                // CHECK FOR CONNECTED LINKS
                let links = edge.selectors.getLinks(state$.value)
                let ins = edge.definition.ins

                let checkAbleInputs = links.flatMap(link => ins.filter(map => {
                    return link.targetPort.startsWith(map.in.toUpperCase() + "_IN") || link.targetPort.startsWith("*")
                }).map(map => map.map))

                console.log(checkAbleInputs)

                // CHECK IF EVERY INPUT HAS BEEN SEET

                let data = checkAbleInputs.map(name => stavanger[name].selectors.getData(state$.value))

                if (data.includes(null)) return [edge.model.setStatus.request(buildStatus(WAITING.waitingForInput))]

                else return updateFunc(action$,state$)
            })
        );

    const onLinksFetchedSetProps = (action$, state$) =>
        action$.pipe(
            ofType(edge.model.fetchLinks.success),
            mergeMap(action => {
                return [page.model.setProp.request({key: "links", value: getInputsOrNull(state$)})]
            })
        );

    const onOutPutForward =  (action$, state$) =>
        action$.pipe(
            ofType(output.model.osloItemCreate.success,
                output.model.osloItemUpdate.success),
            filter(action => action.payload.data.nodeid === output.model.alias),
            mergeMap(action => {
                console.log("called")
                let modelin = action.payload;
                let send = {
                    data: modelin.data,
                    meta:{
                        model: output.definition.type,
                        nodeid: output.model.alias
                    }

                }

                // TODO: Implement Reset Here

                let linklist = page.selectors.getProp(state => state.links)(state$.value)
                let resetlist = linklist
                let settings = settings.selectors.getMerged(state$.value)
                console.log(settings)
                if (settings.locked) {
                    // Updating with Reset List
                    resetlist = linklist.filter(item => settings.locked.map(item => item.value).indexOf(item) === -1)
                    console.log(resetlist)
                }

                let actionList = resetlist.map(staname => stavanger[staname].model.reset.request())
                actionList.push(edge.model.setOutput.request(send))

                return actionList
            })
        );

    const onUpdatersForward = combineEpics(...updaters.map(input => onModelInAskForWhatBuilder(input)))

    return combineEpics(onPageStartedListenToOutput,onOutPutForward,onUpdatersForward,onLinksFetchedSetProps)

}
