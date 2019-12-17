import {combineEpics, ofType} from "redux-observable";
import type {IntensityProfiler} from "./index";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";
import {nodeMaestro} from "../nodeMaestro";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";
import {taskMaestro} from "../taskMaestro";
import {SERVER} from "../../constants/nodestatus";
import {mergeMap} from "rxjs/operators";


export const orchestraterEpic = (stavanger: IntensityProfiler) => {

    const moduleMaestro = nodeMaestro(stavanger)

    const addin1 = taskMaestro(stavanger, {
        inputs: ["transformation"],
        parser: "strainings",
        outputs: ["transformations"],
        parsing: (action, action$, state$ ) => {
            let transformation = stavanger.transformation.selectors.getData(state$.value);
            let settings = stavanger.settings.selectors.getMerged(state$.value)
            let node = stavanger.node.selectors.getState(state$.value)

            if (!transformation) return [stavanger.node.helpers.requireUser("Please set Transformation First")]

            let shape = JSON.parse(transformation.shape)
            let n_channels = shape[2]
            stavanger.page.helpers.log("Channels in Transformation" + n_channels, "Channelsettings",settings.channels)
            // Check integrity
            if (!settings.channels || settings.channels.find( item => item.value >= n_channels)) {
                stavanger.settings.helpers.log("Channels are to great, intensity profile wouldnt work")
                return [stavanger.node.helpers.requireUser("Incorrect Channel set")]
            }


            let straining = {
                data: {
                    settings: JSON.stringify(settings),
                    creator: userIDPortal(state$.value),
                    transformation: transformation.id,//is initial
                    sample: transformation.sample,//is initial
                    strainer: node.entityid, // TODO: This is hard coded and wrong
                    nodeid: stavanger.node.alias,
                    override: false
                },
                meta:{
                    buffer: "of course"
                }


            }
            return [
                stavanger.strainings.model.postItem.request(straining),
                stavanger.node.helpers.setStatus(SERVER.serverPost,"Posting")
            ]


        }
    })

    const onNodeInitSetInitialChannels = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
            mergeMap((action) => {

                    let channels = {
                        info: "First Transformation has yet to arrive in order to set channels, using RGB",
                        map: [
                            {value: 0, label: "Channel R"},
                            {value: 1, label: "Channel G"},
                            {value: 2, label: "Channel B"},
                        ]
                    }

                    return [stavanger.page.model.setProp.request({key: "channels", value: channels})]
                }
            )
        )

    const onTransformationInCheckIfChannelsNeedUpdate = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.transformation.model.setItem.success),
            mergeMap((action) => {

                    let shape = JSON.parse(action.payload.data.shape)
                    let newchannels = shape[3]
                    stavanger.page.helpers.log(shape)

                    let oldchannelnumber = stavanger.page.selectors.getProp(state => state.channels).map.length

                    //if (oldchannelnumber === newchannels) return [ stavanger.node.helpers.requireUser("Channels of New Transformation are the same.. continue")]

                    let channellist = new Array(newchannels)


                    let channels = {
                        info: "Transformation channels are",
                        map: channellist.map(item =>  ({value: item, label: "Channel" + item}))
                    }

                    return [
                        stavanger.page.model.setProp.request({key: "channels", value: channels}),
                        stavanger.node.helpers.requireUser("You need to select the new channels before continuing")
                    ]
                }
            )
        )



    const apiConnections = combineEpics(
        apiConnector(stavanger.transformations),
        apiConnector(stavanger.strainings)
    )

    return combineOrchestrator(stavanger, {
        apiConnections,
        moduleMaestro,
        onNodeInitSetInitialChannels,
        onTransformationInCheckIfChannelsNeedUpdate,
        addin1
    })
}

export default orchestraterEpic