import reducerRegistry from "./routerRegistry";
import {authReducer} from 'redux-implicit-oauth2';


reducerRegistry.register("auth", authReducer);

const rootReducer = reducerRegistry.getReducers()

export default rootReducer;