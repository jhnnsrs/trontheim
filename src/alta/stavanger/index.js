//@flow

import type {Alias, Horten} from "../horten/types";
import _ from 'lodash';
import type {HortenPage} from "../horten/page";
import {createHortenPage} from "../horten/page";

export type StavangerCreator = {
    [string] : (Alias) => Horten
}

export type Stavanger = {
    page: HortenPage,
    parent: Stavanger
}



export function createStavanger<T>(list: StavangerCreator):((Alias) => Stavanger) {
    return function (alias: Alias) {
        // Returns It
        let preliminaryList = {
            page: createHortenPage({type: "page"}), //Page Can be overwritten
            ...list,

        }
        let finallist = {}

        _.forIn(preliminaryList, (hortenCreator, key)=> {
            finallist[key] = hortenCreator(alias,key)
        })

        // maybe at the node host here
        return finallist
    }

}

