import {createStavanger} from "./alta/stavanger";
import {getEpicAndRegisterRootStavanger} from "./alta/react";
import {createHortenEpics} from "./alta/horten/epics";
import type {HortenEpics} from "./alta/horten/epics";
import {createHortenRestAPI} from "./alta/horten/restapi";
import {rootOrchestrater} from "./rootOrchestrator";
import type {HortenRestAPI} from "./alta/horten/restapi";
import {createHortenOslo} from "./alta/horten/oslo";
import type {HortenOslo} from "./alta/horten/oslo";
import {createHortenFakeAPI} from "./alta/horten/fakeapi";
import {createHortenUser} from "./alta/horten/user";
import type {Stavanger} from "./alta/stavanger";
import type {HortenFakeAPI} from "./alta/horten/fakeapi";
import type {HortenUser} from "./alta/horten/user";
import {createHortenHTTP} from "./alta/horten/http";
import type {HortenHTTP} from "./alta/horten/http";
import {createHortenVeil} from "./alta/horten/veil";
import type {HortenVeil} from "./alta/horten/veil";


export type RootStavanger = Stavanger & {
    epics: HortenEpics,
    api: HortenRestAPI,
    fakeapi: HortenFakeAPI,
    user: HortenUser,
    oslo: HortenOslo,
    arnheim: HortenRestAPI,
    http: HortenHTTP,
    veil: HortenVeil,
}

const FakeAPI = {
    frontends: [
        {id: 1, name:"Hund"},
        {id: 2, name:"Hund"},
    ]
}

export const rootStavangerCreator= createStavanger({
    epics: createHortenEpics("epics"),
    api: createHortenRestAPI({type: "OSLO"}),
    fakeapi: createHortenFakeAPI({type: "NANA", map: FakeAPI }),
    oslo: createHortenOslo({type: "OSLO"}),
    arnheim: createHortenRestAPI({type: "ARNHEIM"}),
    user: createHortenUser({type: "User", url: "me"}),
    http: createHortenHTTP({type: "http"}),
    veil: createHortenVeil({type: "veil", alienApi: "foreignnode", statusApi: "foreignnodestatus"})
})

export const rootStavanger: RootStavanger = rootStavangerCreator("root")
export const rootStavangerEpic = getEpicAndRegisterRootStavanger(rootStavanger, rootOrchestrater,"root")

export default rootStavanger