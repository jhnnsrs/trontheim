import {combineEpics, Epic, ofType} from "redux-observable";
import {filter, mergeMap, map} from "rxjs/operators";
import type {HortenDetail} from "../horten/detail";
import * as _ from "lodash"
import type {HortenEdge} from "../horten/edge";
import type {HortenVeil} from "../horten/veil";
import rootStavanger from "../../rootStavanger";
import React from "react";

export interface VeilStavanger {
    veil: HortenVeil
}

export interface EdgeStavanger {
    [string]: HortenDetail,
    edge: HortenEdge,
}

export const edgeModelsVeilMaestro = (edgeStavanger: EdgeStavanger, veilStavanger: VeilStavanger): Epic  => {

    // This allows for
    let modelStavanger = edgeStavanger
    let edge = edgeStavanger.edge
    let veil  = veilStavanger.veil ? veilStavanger.veil : rootStavanger.veil


    function getInputActions(meta, action) {
        let actionslist = []
        _.mapValues(edge.definition.ins, (value) => {
            console.log("Testing", value, meta, modelStavanger)
            try {
                if (meta.model === value.in) {
                    actionslist.push(modelStavanger[value.map].model.setItem.request(action.payload))
                    console.log("Mapping to ", value.map)
                }
                if (value.in === "*") {
                    actionslist.push(modelStavanger[value.map].model.setItem.request(action.payload))
                    console.log("Mapping to ", value.map)
                }
            } catch (e) {
                console.warn("Multiple models found where list and detail are mixed")
                actionslist.push(edge.model.dynamic("WARNING").request(e))
            }
        })
        return actionslist;
    }



    const channelID = _.uniqueId()

    //TODO: Set Node Output to FlowDiagram
    const onModelInSetStavangerModel = (action$, state$) =>
        action$.pipe(
            ofType(edge.model.setInput.request),
            mergeMap(action => {
                let {meta} = action.payload

                // Check if Ege Is Popped or Has Alien, otherwise publish to Popped
                let hasPopped = edge.selectors.hasPopped(state$.value)
                let hasAlien = edge.selectors.hasAlien(state$.value)
                if (hasPopped) {
                    let payload = {...action.payload, meta: {...action.payload.meta, channel: channelID}}
                    return [veil.model.sendMessage.request(payload)]
                }
                if (hasAlien) {
                    let payload = {...action.payload, meta: {...action.payload.meta, alien: edge.alias}}
                    return [veil.model.sendMessage.request(payload)]
                }


                let actionslist = getInputActions(meta, action);
                return actionslist
            }));


    const onPageStartedCheckIfPoppedAndWaitForMessages = (action$, state$) =>
        action$.pipe(
            ofType(edge.model.setModel.success),
            filter(action => edge.selectors.isPopped(state$.value)),
            mergeMap(action => {
                let poppedchannel = edge.selectors.isPopped(state$.value)
                console.log(poppedchannel)
                return action$.pipe(
                        ofType(veil.model.channelMessage(poppedchannel).request),
                        map(action => edge.model.setInput.request(action.payload))
                        )

                }
            ));

    const onPageStartedCheckIfAlienAndWaitForMessages = (action$, state$) =>
        action$.pipe(
            ofType(edge.model.setModel.success),
            filter(action => edge.selectors.isAlien(state$.value)),
            mergeMap(action => {
                    let alien = edge.selectors.isAlien(state$.value)
                    console.log(alien)
                    return action$.pipe(
                        ofType(veil.model.alienMessage(alien).request),
                        map(action => edge.model.setInput.request(action.payload))
                    )

                }
            ));

    const onPageStartedCheckIfPoppedAndListenToChannel = (action$, state$) =>
        action$.pipe(
            ofType(edge.model.setModel.success),
            filter(action => edge.selectors.isPopped(state$.value)),
            map( action => veil.model.openChannel.request(edge.selectors.isPopped(state$.value)))
        )

    const onPageStartedCheckIfAlienAndListenToAlien = (action$, state$) =>
        action$.pipe(
            ofType(edge.model.setModel.success),
            filter(action => edge.selectors.isAlien(state$.value)),
            map( action => veil.model.openAlien.request(edge.selectors.isAlien(state$.value)))
        )


    const onPoppingEdge = (action$, state$) =>
        action$.pipe(
            ofType(edge.model.pop.request),
            mergeMap(action => {
                let node = action.payload
                let link = "/nodepop/" + node.baseid + '/instance/' + node.instanceid + '/channel/' + channelID
                window.open(link,node.nodeid, "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=700")

                // Open Channel to new Tag
                return [
                    veil.model.openChannel.request(channelID),edge.model.pop.success(channelID)]

            }));

    const onAlienateEdge = (action$, state$) =>
        action$.pipe(
            ofType(edge.model.alienate.request),
            mergeMap(action => {
                let node = action.payload
                let link = "/alien/" + node.baseid + '/instance/' + node.instanceid
                window.open(link,node.instanceid, "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=700")

                // Open Channel to new Tag
                return [
                    veil.model.openAlien.request(edge.alias),
                    edge.model.alienate.success(edge.alias)]

            }));

    const onHomeComingEdge = (action$, state$) =>
        action$.pipe(
            ofType(edge.model.homecoming.request),
            mergeMap(action => {

                // Close Old Channel
                return [
                    veil.model.closeAlien.request(edge.alias),
                    edge.model.homecoming.success(edge.alias)]

            }));

    const onUnpoppingEdge = (action$, state$) =>
        action$.pipe(
            ofType(edge.model.unpop.request),
            mergeMap(action => {
                let {meta} = action.payload

                // Open Channel to new Tag
                return [
                    veil.model.closeChannel(channelID).request(),edge.model.unpop.success(channelID)]

            }));

    const onBeingPoppedForwardingInput = (action$, state$) =>
        action$.pipe(
            ofType(veil.model.channelMessage(channelID).request),
            filter( action => edge.selectors.hasPopped(state$.value)),
            mergeMap(action => {
                let {meta} = action.payload
                // Open Channel to new Tag
                return [edge.model.setOutput.request(action.payload)]

            }));

    const onBeingAlienForwardingInput = (action$, state$) =>
        action$.pipe(
            ofType(veil.model.alienMessage(edge.alias).request),
            filter( action => edge.selectors.hasAlien(state$.value)),
            mergeMap(action => {
                let {meta} = action.payload
                // Open Channel to new Tag
                return [edge.model.setOutput.request(action.payload)]

            }));





    return combineEpics(
        onModelInSetStavangerModel,
        onUnpoppingEdge,
        onPageStartedCheckIfPoppedAndListenToChannel,
        onPageStartedCheckIfAlienAndListenToAlien,
        onPageStartedCheckIfAlienAndWaitForMessages,
        onPoppingEdge,
        onHomeComingEdge,
        onAlienateEdge,
        onBeingAlienForwardingInput,
        onPageStartedCheckIfPoppedAndWaitForMessages,
        onBeingPoppedForwardingInput)
}