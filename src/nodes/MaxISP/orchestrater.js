import {combineEpics} from "redux-observable";
import type {LineRectStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {serverRequestConductor} from "../../alta/conductor/serverRequestConductor";
import {userIDPortal} from "../../portals";


export const orchestraterEpic = (stavanger: LineRectStavanger) => {

    const conductor = serverRequestConductor(stavanger, {
        inputs: ["representation"],
        outputs: ["representations"],
        parser: "filterings",
        parserFunc: (action$, state$) => {
            let representation = stavanger.representation.selectors.getData(state$.value);
            let settings = stavanger.settings.selectors.getMerged(state$.value)
            let node = stavanger.edge.selectors.getModel(state$.value)

            let filtering = {
                data: {
                    settings: JSON.stringify(settings),
                    creator: userIDPortal(state$.value),
                    filter: node.entityid,
                    experiment: representation.experiment,
                    sample: representation.sample,
                    representation: representation.id,
                    nodeid: node.nodeid
                },
                meta:{
                    buffer: "None"
                }


            }

            console.log("posting filtering", filtering)
            return [stavanger.filterings.model.postItem.request(filtering),]

        }
    })

    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        itemConnector(stavanger.representation),
        apiConnector(stavanger.representations),
        apiConnector(stavanger.filterings)
    )

    return combineEpics(conductor,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic