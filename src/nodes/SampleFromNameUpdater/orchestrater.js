import {combineEpics, ofType} from "redux-observable";
import {filter, mergeMap} from "rxjs/operators";
import type {SampleFromNameUpdaterStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";

const XRegExp = require("xregexp")


export const orchestraterEpic = (stavanger: SampleFromNameUpdaterStavanger) => {

    const moduleMaestro = createEdgeMaestro(stavanger)

    const onInitializedLoadExperiments = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.request),
            mergeMap( action => {
                let userid = userIDPortal(state$.value)
                return [
                    stavanger.filematchstrings.model.fetchList.request({meta: {filter: { creator: userid}}})]

            })
        )

    const onAnimalsSet = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.animals.model.fetchList.success),
            mergeMap( action => {
                let list = action.payload.data
                if (list.length > 1) return [stavanger.edge.model.requireUser.request("TOO MANY ANIMALS")]
                if (list.length < 1) return [stavanger.edge.model.requireUser.request("NO ANIMAL MATCHING EXPRESSION FOUND")]
                let currentExtracted = stavanger.extractedInformation.selectors.getData(state$.value)

                return [stavanger.extractedInformation.model.setItem.request({data: {...currentExtracted, animal: list[0].id}})]

            })
        )

    const onExperimentalGroupSet = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.experimentalgroups.model.fetchList.success),
            mergeMap( action => {
                let list = action.payload.data
                if (list.length > 1) return [stavanger.edge.model.requireUser.request("TOO MANY EXPERIMENTAL GROUPS")]
                if (list.length < 1) return [stavanger.edge.model.requireUser.request("NO EXPERIMENTAL GROUPS MATCHING EXPRESSION FOUND")]
                let currentExtracted = stavanger.extractedInformation.selectors.getData(state$.value)

                return [stavanger.extractedInformation.model.setItem.request({data: {...currentExtracted, experimentalgroup: list[0].id}})]

            })
        )

    const onExtractedInformationSetCheckForIntegrity = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.extractedInformation.model.setItem.success),
            mergeMap( action => {
                let information = action.payload.data
                console.log(information)

                if (!information.animal) return [stavanger.edge.model.requireUser.request("WAITING FOR ANIMAL")]
                if (!information.experimentalgroup) return [stavanger.edge.model.requireUser.request("WAITING FOR EXPGROUP")]
                let currentExtracted = stavanger.extractedInformation.selectors.getData(state$.value)

                let oldSample = stavanger.sample.selectors.getData(state$.value)

                let updatedSample = {
                    data: {
                        ...oldSample, ...currentExtracted, nodeid: stavanger.sample.model.alias
                    },
                    meta: {
                        fresh: "New and Nice"
                    }
                }
                console.log(updatedSample)
                return [stavanger.sample.model.updateItem.request(updatedSample)]

            })
        )

    const onUpdatedSampleInForward = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.sample.model.updateItem.success,stavanger.sample.model.osloItemUpdate.success, stavanger.sample.model.updateItem.success),
            filter(action => action.payload.data.nodeid === stavanger.sample.model.alias),
            mergeMap(action => {
                console.log("called")
                let modelin = action.payload;
                let send = {
                    data: modelin.data,
                    meta:{
                        model: stavanger.sample.definition.type,
                        nodeid: stavanger.sample.model.alias
                    }

                }
                return [stavanger.edge.model.setOutput.request(send),
                    stavanger.edge.model.setProgress.request(0)]
            })
        )



    const onSampleInCheckName = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.sample.model.setItem.success),
            mergeMap( action => {
                let sample = action.payload.data
                let filematchstring = stavanger.filematchstrings.selectors.getSelected(state$.value).data

                if (!filematchstring) return [stavanger.edge.model.requireUser.request(true)]
                console.log("using reexp",filematchstring.regexp)
                let reg = RegExp(filematchstring.regexp,'g')
                let match = XRegExp.exec(sample.name, reg)

                console.log(match.groups)
                let testing = match.groups

                let actions = []
                if (testing){
                    if(testing.animal) actions.push(stavanger.animals.model.fetchList.request({meta: {filter: { name: testing.animal}}}))
                    if(testing.animalid) actions.push(stavanger.animals.model.fetchList.request({meta: {filter: { id: testing.animalid}}}))
                    if(testing.expgroup) actions.push(stavanger.experimentalgroups.model.fetchList.request({meta: {filter: { name: testing.expgroup}}}))
                }

                return actions

            })
        )

    const apiConnections = combineEpics(
        itemConnector(stavanger.sample),
        itemConnector(stavanger.sampleout),
        apiConnector(stavanger.experiments),
        apiConnector(stavanger.animals),
        apiConnector(stavanger.experimentalgroups),
        apiConnector(stavanger.filematchstrings),
    )

    return combineEpics(
        onInitializedLoadExperiments,
        onSampleInCheckName,
        onExtractedInformationSetCheckForIntegrity,
        onAnimalsSet,
        onExperimentalGroupSet,
        onUpdatedSampleInForward,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic