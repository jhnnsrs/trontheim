import type {Stavanger} from "../../alta/stavanger";
import {createStavanger} from "../../alta/stavanger";
import type {HortenOAuth} from "../../alta/horten/oauth";
import {createHortenOAuth} from "../../alta/horten/oauth";


export type HeaderStavanger = Stavanger & {
    oauth: HortenOAuth
}

export const headerStavanger: HeaderStavanger = createStavanger({
    oauth: createHortenOAuth({type: "OAUTH"}),
})

