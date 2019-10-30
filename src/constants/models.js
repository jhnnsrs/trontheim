import * as constants from "./index";

export const getModels = () => {
    return [
        {model: constants.REPRESENTATION, isServerside: true,},
        {model: constants.SLICE, isServerside: false,},
        {model: constants.EXHIBIT, isServerside: true,},
        {model: constants.DISPLAY, isServerside: true,},
        {model: constants.SAMPLE, isServerside: true,},
        {model: constants.ANIMAL, isServerside: true,},
        {model: constants.EXPERIMENTALGROUP, isServerside: true,},
        {model: constants.EXPERIMENT, isServerside: true,},
        {model: constants.TRANSFORMATION, isServerside: true,},
        {model: constants.CLUSTERDATA, isServerside: true,},
        {model: constants.MASK, isServerside: true,},
        {model: constants.BIOSERIES, isServerside: true,},
        {model: constants.BIOIMAGE, isServerside: true,},
        {model: constants.ROI, isServerside: true,},
        {model: constants.USER, isServerside: true,},
        {model: constants.LOCKER, isServerside: true,},
        {model: constants.VOLUMEDATA, isServerside: true,},
        {model: constants.REFLECTION, isServerside: true,},
        {model: constants.STAR, isServerside: false,},
        {model: constants.IMPULS, isServerside: false,},
        {model: constants.BOUNDS, isServerside: false,},
    ]
}

export const getChannels = ()  => {
    return ["NULL","image","nifti","maxisp"]

}

export const getNodeClass = ()  => {
    return ["classic-node"]

}