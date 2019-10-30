import {combineEpics} from "redux-observable";
import type {BioConverterStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {parserConductor} from "../../alta/conductor/parserconductor";
import {userIDPortal} from "../../portals";


export const orchestraterEpic = (stavanger: BioConverterStavanger) => {

    const moduleMaestro = createEdgeMaestro(stavanger)

    const parserconductor = parserConductor(stavanger,
        {
            input: "bioseries",
            parser: "conversings",
            output: ["samples","representations"],
            parserFunc: (payload,state) => {
                let bioseries = payload;
                let settings = stavanger.settings.selectors.getMerged(state)
                let node = stavanger.edge.selectors.getModel(state)

                let conversing = {
                    data: {
                        settings: JSON.stringify(settings),
                        creator: userIDPortal(state),
                        bioserie: bioseries.data.id,//is initial
                        converter: node.entityid,
                        outputvid: 0,
                        experiment: bioseries.data.experiment,
                        nodeid: node.nodeid,
                        override: false
                    },
                    meta:{
                        buffer: "None"
                    }


                }

                return conversing
            }
        })

    const apiConnections = combineEpics(
        itemConnector(stavanger.bioseries),
        apiConnector(stavanger.samples),
        apiConnector(stavanger.representations),
        apiConnector(stavanger.conversings)
    )

    return combineEpics(
        parserconductor,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic