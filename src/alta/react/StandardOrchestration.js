import {combineEpics, ofType} from "redux-observable";
import type {HortenPage} from "../horten/page";
import type {Horten} from "../horten/types";
import {mergeMap} from "rxjs/operators";


export interface StandardStavanger {
    page: HortenPage,
    [string]: Horten
}

export const standardOrchestrator =  (stavanger: StandardStavanger) => {

    let page = stavanger.page


    const onResetDesiredKillStavanger = (action$, state$) =>
        action$.pipe(
            ofType(page.model.resetPage.request),
            mergeMap(action => {
                    console.log(action)
                    let actions = Object.keys(stavanger).map(
                        item => {
                            try {
                                if (item == "parent") return null
                                return stavanger[item].model.reset.request(action.meta)
                            }
                            catch (e){
                                console.log(item,e)
                                return {type: "FAILURE"}
                            }
                        }
                    ).filter( item => item !== null)
                    return [...actions, page.model.killPage.success(action.payload,action.meta)]
                }
            ));

    const onPageKillSuccessEndEpic = (action$, state$) =>
        action$.pipe(
            ofType(page.model.killPage.success),
            mergeMap(action => {
                    return [action.meta.end.request()]
                }
            ));

    return combineEpics(onResetDesiredKillStavanger,onPageKillSuccessEndEpic)
}

export default standardOrchestrator