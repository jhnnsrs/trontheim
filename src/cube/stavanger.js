import type {HortenCube} from "../alta/horten/cube";
import type {Stavanger} from "../alta/stavanger";
import type {HortenItem} from "../alta/horten/item";

export type CubeStavanger = Stavanger & {
    cube: HortenCube,
    exhibit: HortenItem
}