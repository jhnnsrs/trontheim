import * as types from "./types";
import * as constants from "./index";


export const REFLECTION = {type: types.REFLECTIONTYPE, url: "reflections"}
export const DEF_ARNHEIMHOST = { type: types.ARNHEIMHOST, url: "arnheimhosts"}
export const DEF_ENTITY = {type: "entity", url: "nodes"};
export const DEF_NODE = {type: constants.NODE, url: "nodes"};
export const DEF_VARIETY = {type: constants.NODEVARIETY, url: "nodevariety"};
export const DEF_NODETYPE = {type: constants.NODETYPE, url: "nodetype"};
export const DEF_NODEELEMENT = {type: constants.NODEELEMENT, url: "nodeelement"};
export const DEF_ENTITYNULL = {type: constants.ENTITY, url: "none"};
export const DEF_BIOIMAGE = {type: constants.BIOIMAGE, url: "bioimages"};
export const DEF_SAMPLE = {type: constants.SAMPLE, url: "samples"};
export const DEF_ANIMAL = {type: constants.ANIMAL, url: "animals"};
export const DEF_EXPERIMENTALGROUP = {type: constants.EXPERIMENTALGROUP, url: "experimentalgroups"};
export const DEF_BIOSERIES = {type: constants.BIOSERIES, url: "bioseries"};
export const DEF_FLOW = {type: constants.FLOW, url: "filterflows"};
export const DEF_EXPERIMENT = {type: constants.EXPERIMENT, url: "experiments"};
export const DEF_FILEMATCHSTRING = {type: constants.FILEMATCHSTRING, url: "filematchstrings"};
export const DEF_ROI = {type: constants.ROI, url: "rois"};
export const DEF_TRANSFORMATION = {type: constants.TRANSFORMATION, url: "transformations"};
export const DEF_DISPLAY = {type: constants.DISPLAY, url: "displays"};
export const DEF_REPRESENTATION = {type: constants.REPRESENTATION, url: "representations"};
export const DEF_EXHIBIT = {type: constants.EXHIBIT, url: "exhibits"};
export const DEF_MUTATING = {type: constants.MUTATING, url: "mutatings"};
export const DEF_REFLECTION = {type: constants.REFLECTION, url: "reflections"};
export const DEF_LAYOUT = {type: constants.LAYOUT, url: "layouts"};
export const DEF_VOLUMEDATA = {type: constants.VOLUMEDATA, url: "volumedata"};
export const DEF_IMPULS = {type: constants.IMPULS, url: "null"};
export const DEF_CLUSTERDATA = {type: constants.CLUSTERDATA, url: "clusterdata"};
export const DEF_LOCKER = {type: constants.LOCKER, url: "lockers"};
export const DEF_QUESTION = {type: constants.QUESTION, url: "questions"};
export const DEF_ANSWER = {type: constants.ANSWER, url: "answers"};
export const DEF_ORACLE = {type: constants.ORACLE, url: "oracles"};
export const DEF_ANSWERING = {type: constants.ANSWERING, url: "answerings"};
export const DEF_USER = {type: constants.USER, url: "users"};
export const DEF_VISUALIZER = {type: constants.VISUALIZER, url: "visualizers"};
export const DEF_VISUALIZING = {type: constants.VISUALIZING, url: "visualizings"};
export const DEF_PROFILE = {type: constants.PROFILE, url: "profiles"};
export const DEF_EXCELEXPORT = {type: constants.EXCELEXPORT, url: "excelexports"};
export const DEF_FOREIGNNODEREQUEST = {type: constants.FOREIGNODEREQUEST, url: "foreignnode"};
export const DEF_FOREIGNNODESTATUS = {type: constants.FOREIGNODESTATUS, url: "foreignnodestatus"};