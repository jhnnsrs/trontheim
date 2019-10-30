import type {HortenEdge} from "../horten/edge";
import type {HortenNomogram} from "../horten/nomogram";
import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HortenItem} from "../horten/item";
import type {HortenTable} from "../horten/table";
import type {HortenPage} from "../horten/page";
import type {HortenValue} from "../horten/value";
import {userIDPortal} from "../../portals";
import {Observable} from "rxjs";


export type EdgeStavanger = {
    edge: HortenEdge,
    page: HortenPage,
    [string]: HortenItem,
}

export type FilterMeta = any


export type SelectionConfiguration = {
    filters: [string],
    output: string,
    enablePassThrough: boolean,
    filterFunc: (Observable, Observable) => FilterMeta, // params: Payload and State,Should Return the Parsing Object e.g analyzing or filtering

}


export const selectionConductor = (nodeStavanger: EdgeStavanger, configuration: SelectionConfiguration): Epic  => {
    /**
     * Builds a WatcherConductor that helps with a lot of stuf
     *
     * @type {HortenNomogram}
     */
    let output: HortenTable = nodeStavanger[configuration.output] ? nodeStavanger[configuration.output] : nodeStavanger.output
    let filters: [HortenValue] = configuration.filters.map( item => nodeStavanger[item] ? nodeStavanger[item] : null).filter(item => item != null)
    let filterFunc = configuration.filterFunc
    let edge = nodeStavanger.edge
    let page = nodeStavanger.page


    // HELPER FUNCTIONS
    const getInputsOrNull = (state$) => {
        let links = edge.selectors.getLinks(state$.value)
        console.log(output.definition.type,links)
        let ins = edge.definition.ins

        let checkAbleInputs = links.flatMap(link => ins.filter(map => {
            return link.targetPort.startsWith(map.in.toUpperCase() + "_IN") || link.targetPort.startsWith("*")
        }).map(map => map.map))

        return checkAbleInputs
    }

    const allInputsAreSet = (inputs, state$) => {
        let data = inputs.map(name => nodeStavanger[name].selectors.getData(state$.value))
        return !data.includes(null)

    }

    // ON PAGE START IT CHECKS IF AT ALL LINKS ARE CONNECTED AND FETCHES JUST WITH USERFILTER IF NOT
    const onPageStart = (action$, state$) =>
        action$.pipe(
            ofType(page.model.initPage.success),
            mergeMap(action => {
                return [edge.model.fetchLinks.request()]

            })
        );


    const onLinksFetched = (action$, state$) =>
        action$.pipe(
            ofType(edge.model.fetchLinks.success),
            mergeMap(action => {
                if (getInputsOrNull(state$).length == 0){
                    return [output.model.fetchList.request({meta: {filter: {creator: userIDPortal(state$.value)}}})]
                }
                else return [edge.model.setProgress.request("WAITING FOR FILTERS")]
            })
        );

    const onLinksFetchedSetProps = (action$, state$) =>
        action$.pipe(
            ofType(edge.model.fetchLinks.success),
            mergeMap(action => {
                return [page.model.setProp.request({links: getInputsOrNull(state$)})]
            })
        );



    const onFilterInBuilder = (filter) => (action$, state$) =>
        action$.pipe(
            ofType(filter.model.setItem.success),
            mergeMap(action => {

                let checkAbleInputs = getInputsOrNull(state$)
                console.log("Checking these Inputs for Fullfillment", checkAbleInputs)

                if (allInputsAreSet(checkAbleInputs,state$)){
                    let filter = filterFunc(action$,state$)
                    return [output.model.fetchList.request({meta: {filter: filter}})]

                }
                else return [edge.model.setProgress.request("WAITING FOR FILTERS")]

            })
        );

    const onListHasArrivedAndHasSingleItem = (action$, state$) =>
        action$.pipe(
            ofType(output.model.fetchList.success),
            mergeMap(action => {
                let items = output.selectors.getList(state$.value)

                if (items.length == 1) {

                    let send = {
                        data: items[0].data,
                        meta:{
                            model: output.definition.type,
                            nodeid: output.model.alias
                        }

                    }

                    return [edge.model.setOutput.request(send),
                        edge.model.requireUser.request(false)]
                }
                else return [ edge.model.requireUser.request(true)]
            })
        );


    const onItemSelectedForward = (action$, state$) =>
        action$.pipe(
            ofType(output.model.selectItem.success),
            mergeMap(action => {
                let item = action.payload;
                let outputsend= {
                    data: item.data,
                    meta:{
                        model: output.definition.type,
                        nodeid: output.model.alias
                    }

                }
                return [edge.model.setOutput.request(outputsend),
                    edge.model.requireUser.request(false)]
            })
        );

    const onFiltersInEpic = combineEpics(...filters.map(input => onFilterInBuilder(input)))


    return combineEpics(onFiltersInEpic,onLinksFetched,onLinksFetchedSetProps,onItemSelectedForward,onPageStart,onListHasArrivedAndHasSingleItem)
}