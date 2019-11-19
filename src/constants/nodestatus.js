
export type StatusCode = number
//GRAPH ERROR
const graphConnectionError: StatusCode = 701

//NODE ERROR
const functionFailed: StatusCode  = 801

// ATTENTION STATES
const requireUserAtStart: StatusCode  = 401
const requireUserOnInput: StatusCode  = 402
const attentionElse: StatusCode  = 499

//PROGRESS STATES

//WAITING
const initialWait: StatusCode  = 100
const waitingForInput: StatusCode  = 110

//SERVER
const serverPost: StatusCode  = 210
const serverProgress: StatusCode  = 220
const serverWarning: StatusCode  = 230
const serverError: StatusCode  = 240


// DONE
const outputSend: StatusCode  = 310


export interface StatusCodeContainer {
    [string]: StatusCode
}


export const UNKNOWN: StatusCodeContainer = {
    notSet: 999
}


export const ATTENTION: StatusCodeContainer = {
    requireUserAtStart: requireUserAtStart,
    requireUserOnInput: requireUserOnInput,
    ELSE: attentionElse
}

export const SERVER: StatusCodeContainer = {
    serverPost: serverPost,
    serverProgress: serverProgress,
    serverWarning: serverWarning,
    serverError: serverError,
}

export const WAITING: StatusCodeContainer = {
    initialWait: initialWait,
    waitingForInput: waitingForInput
}

export const DONE: StatusCodeContainer = {
    outputSend: outputSend,
}

export const NODEERROR: StatusCodeContainer = {
    functionFailed: functionFailed,
}

export const GRAPHERROR: StatusCodeContainer = {
    connectionError: graphConnectionError,
}


export function buildStatus(code: StatusCode, message: string = null){
    return { code: code, message: message}
}