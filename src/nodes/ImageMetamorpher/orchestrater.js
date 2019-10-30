import {combineEpics} from "redux-observable";
import type {BioConverterStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";
import {serverRequestConductor} from "../../alta/conductor/serverRequestConductor";


export const orchestraterEpic = (stavanger: BioConverterStavanger) => {

    const conductor = serverRequestConductor(stavanger, {
        inputs: ["representation"],
        outputs: ["displays"],
        parser: "metamorphings",
        parserFunc: (action$, state$) => {
            let representation = stavanger.representation.selectors.getData(state$.value);
            let settings = stavanger.settings.selectors.getMerged(state$.value)
            let node = stavanger.edge.selectors.getModel(state$.value)

            let metamorphing = {
                data: {
                    settings: JSON.stringify(settings),
                    creator: userIDPortal(state$.value),
                    representation: representation.id,//is initial
                    sample: representation.sample,//is initial
                    metamorpher: node.entityid,
                    nodeid: node.nodeid,
                    override: false
                },
                meta:{
                    buffer: "of course"
                }


            }
            return [stavanger.metamorphings.model.postItem.request(metamorphing),]

        }
    })

    const moduleMaestro = createEdgeMaestro(stavanger)

    const apiConnections = combineEpics(
        itemConnector(stavanger.representation),
        apiConnector(stavanger.metamorphings),
        apiConnector(stavanger.displays)
    )


    return combineEpics(
        conductor,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic