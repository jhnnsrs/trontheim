import type {HortenGraph} from "../alta/horten/graph";
import type {HortenRegistry} from "../alta/horten/registry";
import type {HortenNode, HortenNodeDefinition} from "../alta/horten/node";
import {ActionsObservable, combineEpics, ofType, StateObservable} from "redux-observable";
import {zip, of} from "rxjs";
import {mergeMap, switchMap} from "rxjs/operators";
import {ATTENTION, buildStatus, GRAPHERROR, NODEERROR, SERVER} from "../constants/nodestatus";
import type {HortenItem} from "../alta/horten/item";
import type {Stavanger} from "../alta/stavanger";
import {Action} from "redux";
import type {HortenList} from "../alta/horten/list";
import type {HortenPage} from "../alta/horten/page";
import {combineOrchestrator} from "../alta/react/EpicRegistry";


export interface NodeMeastroDefinition {
    outport: string,
    out: string,
    filters: [string],
    filterActions: ([Action], ActionsObservable, StateObservable) => any
}


export const selectorMeastro = (stavanger: Stavanger, definition: NodeMeastroDefinition) => {

    const node: HortenNode = stavanger.node
    const page: HortenPage = stavanger.page

    const filters = definition.filters ? definition.filters : []
    const filterActions = definition.filterActions ? definition.filterActions : []
    const out: HortenList = stavanger[definition.out]

    const graph: HortenGraph = stavanger.parent.graph
    const registry: HortenRegistry = stavanger.parent.registry

    const nodeDefinition: HortenNodeDefinition = stavanger.node.definition


    const buildFilters = (ports) => {

        const connectedInPorts = ports.filter(item => item.links.length > 0 && item.in).map(item => item.label)
        const connectedFilters = filters.filter( item => connectedInPorts.includes(item))
        return connectedFilters
    }

    const buildZip = (ports,action$) => {

        const filters = buildFilters(ports)
        stavanger.page.helpers.log("Will wait for these inputs", filters)
        if (filters.length === 0) return  of(1)
        const actionStreams = filters.map(staname => action$.ofType(stavanger[staname].model.setItem.success))

        return zip(...actionStreams)
    }

    const waitForAllConnectionsToFilter = (action$, state$) =>
        action$.pipe(
            ofType(page.model.initPage.success),
            switchMap( action => {
                let ports = graph.selectors.getNode(node.alias)(state$.value).ports
                return buildZip(ports,action$).pipe(
                    mergeMap(actions =>
                    {
                        return [out.model.fetchList.request({meta: {filter: filterActions(actions, action$, state$)}})]
                    })
                )
            })
        )


    const waitForListToArriveAndSendOnIfOnlyOnItem = (action$, state$) =>
        action$.pipe(
            ofType(out.model.fetchList.success),
            mergeMap( action => {
                const list = out.selectors.getList(state$.value)
                switch (list.length) {
                    case 0: return [node.model.setStatus.request(buildStatus(NODEERROR.functionFailed, "Filtered List contains zero items"))]
                    case 1: return [node.model.setOut(definition.outport).request(list[0])]
                    default: return [node.model.setStatus.request(buildStatus(ATTENTION.requireUserOnInput, "Please select an Item from the List"))]
                }

            })
        )

    const onUserSelectsItemForward = (action$, state$) =>
        action$.pipe(
            ofType(out.model.selectItem.request),
            mergeMap( action => {

               return [
                   node.model.setOut(definition.outport).request(action.payload),
                    ]

            })
        )





    return combineOrchestrator(stavanger,{
            waitForAllConnectionsToFilter,
            waitForListToArriveAndSendOnIfOnlyOnItem,
            onUserSelectsItemForward
        })
}
