import {combineEpics, ofType} from "redux-observable";
import type {ChannelMapper} from "./index";
import {apiConnector} from "../../rootMaestros";
import {nodeMaestro} from "../nodeMaestro";
import {selectorMeastro} from "../selectorMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {mergeMap} from "rxjs/operators";


export const orchestraterEpic = (stavanger: ChannelMapper) => {


    const addin =  nodeMaestro(stavanger, null)

    const onRepInFetchChannels = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.representation.model.setItem.request),
            mergeMap( action => {

                let rep = action.payload.data

                return [
                    stavanger.channels.model.fetchList.request({data: {id: rep.zarr}}),
                ]

            })
        )

    const onSelectChannelForward = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.channels.model.selectItem.request),
            mergeMap( action => {

                return [
                    stavanger.node.model.setOut("channel").request(action.payload),
                ]

            })
        )


    const apiConnections = combineEpics(
        apiConnector(stavanger.channels)
    )

    return combineOrchestrator(stavanger, {
            onRepInFetchChannels,
            onSelectChannelForward,
            apiConnections,
            addin,
        }
    )
}

export default orchestraterEpic