//Maestros
import {pageNodesMaestro} from "../../alta/maestro/page-nodes";
import {pageSettingsMaestro} from "../../alta/maestro/page-settings";
import {combineEpics} from "redux-observable";
import {edgeGraphMaestro} from "../../alta/maestro/edge-graph";
import {pageEdgeMaestro} from "../../alta/maestro/page-edge";
import {edgeModelsVeilMaestro} from "../../alta/maestro/edge-models";


export const createEdgeMaestro = (stavanger) => {
    // The Parent of this Stavanger outght to be hosting a Graph and Nodes instance for it to function properly

    const maestro_edgeGraph = edgeGraphMaestro(stavanger, stavanger.parent)
    const meastro_pageNodes = pageNodesMaestro(stavanger, stavanger.parent)

    // Meastros for within the
    const maestro_pageEdge = pageEdgeMaestro(stavanger)
    const meastro_pageSettings = pageSettingsMaestro(stavanger)
    const meastro_edgeModels = edgeModelsVeilMaestro(stavanger, stavanger.parent)

    return combineEpics(maestro_edgeGraph, meastro_pageNodes, maestro_pageEdge, meastro_pageSettings, meastro_edgeModels)
}