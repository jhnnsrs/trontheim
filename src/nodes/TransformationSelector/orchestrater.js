import {combineEpics} from "redux-observable";
import type {TransformationSelectorStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {selectorConductor} from "../../alta/conductor/selectorconductor";


export const orchestraterEpic = (stavanger: TransformationSelectorStavanger) => {

    const cond = selectorConductor(stavanger, {
        input: "sample",
        output: "transformations",
        filterFunc: (action,state,stavanger) => ({meta: {filter: { sample: action.payload.data.id}}}),
        roomFunc: (action,state,stavanger) => ({meta: {room: { sample: action.payload.data.id}}})
    })



    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        itemConnector(stavanger.sample),
        apiConnector(stavanger.transformations)
    )

    return combineEpics(cond,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic