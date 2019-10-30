import {createStavanger} from "../../alta/stavanger";
import type {Stavanger} from "../../alta/stavanger";
import {createHortenOAuth} from "../../alta/horten/oauth";
import type {HortenOAuth} from "../../alta/horten/oauth";


export type HeaderStavanger = Stavanger & {
    oauth: HortenOAuth
}

export const headerStavanger: HeaderStavanger = createStavanger({
    oauth: createHortenOAuth({type: "OAUTH"}),
})

