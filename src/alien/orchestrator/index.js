import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {AlienStavanger} from "../stavanger";
import {itemConnector} from "../../rootMaestros";

export const orchestraterEpic = (stavanger: AlienStavanger) => {

    const buildNodeFromNode = (node,params) => ({
        ...node,
        nodeid: params.instanceid,
        instanceid: params.instanceid,
        isAlien: params.instanceid,
        isPoppable: false,
        isAlienable: false,
        defaultsettings: JSON.parse(node.defaultsettings),
        base: node.id,
        baseid: params.nodeid

    })

    const onPageInitLoadNode = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap(action => {
                let nodeid = action.payload.match.params.nodeid
                return [
                    stavanger.node.model.fetchItem.request({data: {id: nodeid}}),
                ]
            }));


    const onNodeModelFetchedSetNodes = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.node.model.fetchItem.success),
            mergeMap(action => {
                let params = stavanger.page.selectors.getModel(state$.value).props.match.params

                let receivednode = action.payload.data
                document.title = receivednode.name

                console.log(receivednode)
                console.log(params)

                let node = buildNodeFromNode(receivednode,params)


                return [
                    stavanger.nodes.model.setNodes.success([node]),
                stavanger.graph.model.setGraphFromNodes.request([node])]
            }));

    const apiConnections = combineEpics(
        itemConnector(stavanger.node),
    )

    return combineEpics(onPageInitLoadNode,apiConnections,onNodeModelFetchedSetNodes)
}

export default orchestraterEpic