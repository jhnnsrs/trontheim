import {combineEpics, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import type {NameExtractorStavanger} from "./index";
import {createEdgeMaestro} from "../lib/meastros";
import {apiConnector, itemConnector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";
import {nodeMaestro} from "../nodeMaestro";
import {ATTENTION, buildStatus, NODEERROR} from "../../constants/nodestatus";
import {combineOrchestrator} from "../../alta/react/EpicRegistry";

const XRegExp = require("xregexp")


export const orchestraterEpic = (stavanger: NameExtractorStavanger) => {


    const addin1 = nodeMaestro(stavanger, null)

    const node = stavanger.node
    const page = stavanger.page

    const onInitializedLoadFileStrings = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.page.model.initPage.success),
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

                switch (list.length) {
                    case 0: return [stavanger.node.model.setStatus.request(buildStatus(NODEERROR.functionFailed,"No Animals matching Expressions Found"))]
                    case 1: return [stavanger.node.model.setOut("animals").request(list[0])]
                    default: return [stavanger.node.model.setStatus.request(buildStatus(ATTENTION.requireUserOnInput,"Please select Animal from List"))]

                }

            })
        )

    const onExperimentalGroupSet = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.experimentalgroups.model.fetchList.success),
            mergeMap( action => {
                let list = action.payload.data

                switch (list.length) {
                    case 0: return [node.model.setStatus.request(buildStatus(NODEERROR.functionFailed,"No Experimental Group matching Expressions Found"))]
                    case 1: return [node.model.setOut("experimentalgroup").request(list[0])]
                    default: return [node.helpers.setStatus(ATTENTION.requireUserOnInput,"Please select Experimental Group from List")]

                }

            })
        )

    const onSampleInCheckName = (action$, state$) =>
        action$.pipe(
            ofType(stavanger.sample.model.setItem.success),
            mergeMap( action => {

                let sample = action.payload.data
                let filematchstring = stavanger.filematchstrings.selectors.getSelected(state$.value).data

                if (!filematchstring) return [node.helpers.requireUser("Please Select your Filestring first and resend Model")]

                page.helpers.log("Trying to match using RegExp", filematchstring.regexp)
                let reg = RegExp(filematchstring.regexp,'g')
                let match = XRegExp.exec(sample.name, reg)

                if (!match) return [node.helpers.requireUser("Your filestring does not match the Sample, please choose a different one")]
                if (!match.groups) return [node.helpers.requireUser("Your filestring matches the sample but does not provide groups, please choose a different one")]


                let testing = match.groups

                page.helpers.log(testing)
                const filterBuilder = (filter) => ({meta: {filter: filter}})

                const groupActionMap = {
                    animal: (item) => stavanger.animals.model.fetchList.request(filterBuilder({name: item})),
                    animalid: (item) => stavanger.animals.model.fetchList.request(filterBuilder({id: item})),
                    expgroup: (item) => stavanger.experimentalgroups.model.fetchList.request(filterBuilder({name: item})),
                }

                const actions = Object.entries(testing).map(([key, value]) => (key in groupActionMap) ? groupActionMap[key](value) : null).filter(item => item)

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

    return combineOrchestrator(stavanger, {
            onInitializedLoadFileStrings,
            onSampleInCheckName,
            onAnimalsSet,
            onExperimentalGroupSet,
            apiConnections,
            addin1,
        }
        )
}

export default orchestraterEpic