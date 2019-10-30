import {combineEpics} from 'redux-observable';
// Import epics and combine
import {rootStavangerEpic as rootStavangerEpic} from "./rootStavanger";

export const rootEpic = combineEpics(
    rootStavangerEpic,
);

export default rootEpic