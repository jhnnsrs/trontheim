import type {HortenEdge} from "../horten/edge";
import type {HortenNomogram} from "../horten/nomogram";
import {combineEpics, Epic, ofType} from "redux-observable";
import {filter, mergeMap} from "rxjs/operators";
import type {HortenItem} from "../horten/item";
import type {HortenPage} from "../horten/page";
import type {HortenMold} from "../horten/mold";
import type {HortenValue} from "../horten/value";
import {buildStatus, WAITING} from "../../constants/nodestatus";


export interface EdgeStavanger {
    edge: HortenEdge,
    page: HortenPage,
    [string]: HortenValue,
}

export interface UpdateConfiguration {
    input: string,
    output: string,
    mold: string,
    updaters: [string],
    enablePassThrough: boolean,
    updateFunc: Epic, // params: Payload and State,Should Return the Parsing Object e.g analyzing or filtering

}


export const updateConductor = (nodeStavanger: EdgeStavanger, configuration: UpdateConfiguration): Epic  => {
    /**
     * Builds a WatcherConductor that helps with a lot of stuf
     *
     * @type {HortenNomogram}
     */
    let edge: HortenEdge = nodeStavanger.edge
    let page: HortenPage = nodeStavanger.page
    let mold: HortenMold = nodeStavanger[configuration.mold]
    let output: HortenItem =  nodeStavanger[configuration.output]
    let updaters: [HortenValue] = configuration.updaters.map( item => nodeStavanger[item] ? nodeStavanger[item] : null).filter(item => item != null)
    let updateFunc = configuration.updateFunc
    let stavanger = nodeStavanger

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

                let data = checkAbleInputs.map(name => nodeStavanger[name].selectors.getData(state$.value))

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
                let settings = mold.selectors.getMerged(state$.value)
                console.log(settings)
                if (settings.locked) {
                    // Updating with Reset List
                    resetlist = linklist.filter(item => settings.locked.map(item => item.value).indexOf(item) === -1)
                    console.log(resetlist)
                }

                let actionList = resetlist.map(staname => nodeStavanger[staname].model.reset.request())
                actionList.push(edge.model.setOutput.request(send))

                return actionList
            })
        );

    const onUpdatersForward = combineEpics(...updaters.map(input => onModelInAskForWhatBuilder(input)))

    return combineEpics(onPageStartedListenToOutput,onOutPutForward,onUpdatersForward,onLinksFetchedSetProps)
}