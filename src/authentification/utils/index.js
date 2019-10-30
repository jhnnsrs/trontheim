export const userIDSelector = (state) => { return (state.root.user.id ? state.root.user.id : false) }
export const userSelector = (state) => { return ( state.root.user.currentUser ? state.root.user.currentUser: false) }
export const rootURLSelector = (state) => { return ( state.root.oslo.currentConfig ? state.root.oslo.currentConfig: false) }
