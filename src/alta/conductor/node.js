import type {HortenNomogram} from "../horten/nomogram";
import {combineEpics, Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {HortenPage} from "../horten/page";
import type {HortenRegistry} from "../horten/registry";
import type {HortenNode} from "../horten/node";
import type {HortenMold} from "../horten/mold";
import * as _ from "lodash"
import React from "react";
import {buildStatus, DONE} from "../../constants/nodestatus";

export interface NodeParentStavanger {
    registry: HortenRegistry
}


export interface NodeStavanger {
    page: HortenPage,
    node: HortenNode,
    settings: HortenMold,
    parent: NodeParentStavanger,
}

export interface NodeConfiguration {
    input: string,
    inputModel: string, // The Model Type
    enablePassThrough: boolean,
    list: string, // The Reference to the list
    listFilter: (any) => any, // Should Return a filter object for the list query

}


export const NodeConductor = (nodeStavanger: NodeStavanger, configuration: NodeConfiguration): Epic  => {
    /**
     * Builds a NodeConductor that helps with a lot of stuf
     *
     * @type {HortenNomogram}
     */

    let page = nodeStavanger.page
    let node = nodeStavanger.node
    let settings = nodeStavanger.settings
    let registry = nodeStavanger.parent.registry

    // The Parent of this Stavanger outght to be hosting a Graph and Nodes instance for it to function properly
    //const maestro_nodeGraph = nodeGraphMaestro(stavanger, stavanger.parent)
    //const maestro_pageRegistry = pageRegistryMaestro(stavanger, stavanger.parent)

    const onPageStartRegisterNodeAndSetInitialStateFromRegistry = (action$, state$) =>
        action$.pipe(
            ofType(page.model.initPage.success),
            mergeMap(action => {
                    // Registers itself with its alias
                    let nodeandlinks = registry.selectors.getNodeInit(page.alias)(state$.value)

                    return [
                        registry.model.registerNode.request(page.alias),
                        node.model.init.request(nodeandlinks)
                    ]
                }
            ));

    const onNodeStateInitializedSetDefaultSettings = (action$, state$) =>
        action$.pipe(
            ofType(node.model.init.request),
            mergeMap(action => {
                    return [settings.model.setInitial.request(action.payload.defaultsettings),]
                }
            ));

    // This Sets the Inputs according to Ins Provided in the Definition
    function getInputActions(meta, action) {
        let actionslist = []
        _.mapValues(node.definition.ins, (value) => {
            console.log("Testing", value, meta, nodeStavanger)
            try {
                if (meta.model === value.in) {
                    actionslist.push(nodeStavanger[value.map].model.setItem.request(action.payload))
                    console.log("Mapping to ", value.map)
                }
                if (value.in === "*") {
                    actionslist.push(nodeStavanger[value.map].model.setItem.request(action.payload))
                    console.log("Mapping to ", value.map)
                }
            } catch (e) {
                console.warn("Multiple models found where list and detail are mixed")
                actionslist.push(node.model.dynamic("WARNING").request(e))
            }
        })
        return actionslist;
    }


    const onNodeInputSetMatchToModel = (action$, state$) =>
        action$.pipe(
            ofType(node.model.setInput.request),
            mergeMap(action => {
                let {meta} = action.payload
                return getInputActions(meta, action)
                }
            ));

    const onNodeOutputForwardToRegistry = (action$, state$) =>
        action$.pipe(
            ofType(node.model.setOutput.request),
            mergeMap(action => {
                let {data, meta} = action.payload
                let newmeta = {
                    instanceid: node.alias,
                    model: meta.model
                }
                const payload = {data: data, meta: { ...meta,...newmeta}};

                console.log(payload)


                return [
                    registry.model.onModelIn.request(payload),
                    node.model.setStatus.request(buildStatus(DONE.ouputSend))]
            }))


    return combineEpics(
        onPageStartRegisterNodeAndSetInitialStateFromRegistry,
        onNodeStateInitializedSetDefaultSettings,
        onNodeInputSetMatchToModel,
        onNodeOutputForwardToRegistry)
}