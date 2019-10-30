import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {RegExtractorStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";

const XRegExp = require("xregexp")


export const orchestraterEpic = (stavanger: RegExtractorStavanger) => {

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
                let output = {
                    data: {
                        ...list[0]
                    },
                    meta:{
                        model: stavanger.animals.definition.type,
                        nodeid: stavanger.animals.model.alias
                    }
                }

                return [stavanger.edge.model.setOutput.request(output),
                    stavanger.edge.model.setProgress.request(0)]

            })
        )

    const onExperimentalGroupSet = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.experimentalgroups.model.fetchList.success),
            mergeMap( action => {
                let list = action.payload.data
                if (list.length > 1) return [stavanger.edge.model.requireUser.request("TOO MANY EXPERIMENTALGROUPS")]
                if (list.length < 1) return [stavanger.edge.model.requireUser.request("NO EXPERIMENTALGROUP MATCHING EXPRESSION FOUND")]
                let output = {
                    data: {
                        ...list[0]
                    },
                    meta:{
                        model: stavanger.experimentalgroups.definition.type,
                        nodeid: stavanger.experimentalgroups.model.alias
                    }
                }

                return [stavanger.edge.model.setOutput.request(output),
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
        onAnimalsSet,
        onExperimentalGroupSet,
        apiConnections,
        moduleMaestro)
}

export default orchestraterEpic