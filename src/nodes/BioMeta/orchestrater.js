import {combineEpics} from "redux-observable";
import type {BioMetaStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";
import {serverRequestConductor} from "../../alta/conductor/serverRequestConductor";


export const orchestraterEpic = (stavanger: BioMetaStavanger) => {

    const conductor = serverRequestConductor(stavanger, {
        inputs: ["bioimage"],
        outputs: ["bioseries"],
        parser: "analyzings",
        parserFunc: (action$, state$) => {
            let bioimage = stavanger.bioimage.selectors.getData(state$.value)
            let settings = stavanger.settings.selectors.getMerged(state$.value)
            let node = stavanger.edge.selectors.getModel(state$.value)

            let analyzing = {
                data: {
                    settings: JSON.stringify(settings),
                    creator: userIDPortal(state$.value),
                    experiment: bioimage.experiment,//is initial
                    analyzer: node.entityid,
                    bioimage: bioimage.id,
                    nodeid: node.nodeid
                },
                meta:{
                    buffer: "None"
                }


            }

            return [stavanger.analyzings.model.postItem.request(analyzing),]

        }
    })

    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        itemConnector(stavanger.bioimage),
        apiConnector(stavanger.bioseries),
        apiConnector(stavanger.analyzings)
    )

    return combineEpics(conductor,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic