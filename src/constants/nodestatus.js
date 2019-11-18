
//GRAPH ERROR
const graphConnectionError = 701


// ATTENTION STATES
const requireUserAtStart = 401
const requireUserOnInput = 402
const attentionElse = 499

//PROGRESS STATES

//WAITING
const initialWait = 100
const waitingForInput = 110

//SERVER
const serverPost = 210
const serverProgress = 220
const serverWarning = 230
const serverError = 240


// DONE
const outputSend = 310





export const UNKNOWN = {
    notSet: 999
}


export const ATTENTION = {
    requireUserAtStart: requireUserAtStart,
    requireUserOnInput: requireUserOnInput,
    ELSE: attentionElse
}

export const SERVER = {
    serverPost: serverPost,
    serverProgress: serverProgress,
    serverWarning: serverWarning,
    serverError: serverError,
}

export const WAITING = {
    initialWait: initialWait,
    waitingForInput: waitingForInput
}

export const DONE = {
    ouputSend: outputSend,
}

export const GRAPHERROR = {
    connectionError: graphConnectionError,
}


export function buildStatus(code, message = null){
    return { code: code, message: message}
}