import type {Stavanger} from "../../alta/stavanger";
import type {HortenNodes} from "../../alta/horten/nodes";
import type {HortenGraph} from "../../alta/horten/graph";
import type {HortenItem} from "../../alta/horten/item";
import type {HortenForm} from "../../alta/horten/form";
import type {HortenTable} from "../../alta/horten/table";
import {createStavanger} from "../../alta/stavanger";
import {createHortenForm} from "../../alta/horten/form";
import * as constants from "../../constants";
import {createHortenGraph} from "../../alta/horten/graph";
import {createHortenItem} from "../../alta/horten/item";
import {createHortenTable} from "../../alta/horten/table";
import {createHortenNodes} from "../../alta/horten/nodes";

export type LandingStavanger = Stavanger & {

}


export const landingStavanger: LandingStavanger = createStavanger({
})