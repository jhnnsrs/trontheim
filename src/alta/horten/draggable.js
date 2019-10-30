//@flow
import type {Alias, HortenHelpers, HortenModel, HortenSelectors, HortenType} from "./types";
import {createHorten2} from "./index";
import {Epic, ofType} from "redux-observable";
import {mergeMap} from "rxjs/operators";
import {
    createHortenEpic,
    createHortenHelpers,
    createHortenModel,
    createHortenReducer,
    createHortenSelectors
} from "./creators";
import type {HaldenSelector} from "../halden";
import {createHaldenAction, createHaldenEpic, createHaldenSelector} from "../halden";
import {Reducer} from "redux";
import type {HaldenActions} from "../oslo";
import type {Id} from "../../organizer/smartcomponents/multi-drag/types";
import {DraggableLocation} from "react-beautiful-dnd";


export type HortenDraggableModel = HortenModel & {
    moveIndices: HaldenActions,
    copyIndices: HaldenActions,
    setMoving: HaldenActions,
    setSelected: HaldenActions,
    onDragStarted: HaldenActions,
    onDragEnded: HaldenActions,
    toggleSelection: HaldenActions,
    toggleSelectionInGroup: HaldenActions,
}

export type HortenDraggableSelectors = HortenSelectors & {
    getData: HaldenSelector,
    getSelected: HaldenSelector,
    getMoving: HaldenSelector,
}


export type HortenDraggableHelpers = HortenHelpers & {}


export type HortenDraggableDefaultState = {
    [string]: any
}

export type HortenDraggableNode = {
    nodeid: string,
    type: string,
    requiresUser: string,
}


export type HortenDraggableDefinition = {
    type: HortenType,
    start: (Array<HortenDraggableNode>) => HortenDraggableNode,
    statusOUT: string,
    statusIN: string,
    connectionWRONG: string,

}

export const STATUSOUT = "Send Output"
export const STATUSIN = "Received Input"
export const WRONGCONNECTION = "Connection WRONG"

const defaultDefinition = {
    type: "Normogramm",
    state: () => {},
    statusOUT: STATUSOUT,
    statusIN: STATUSIN,
    connectionWRONG: WRONGCONNECTION
}



export type HortenDraggable = {
    model: HortenDraggableModel,
    selectors: HortenDraggableSelectors,
    helpers: HortenDraggableHelpers,
    definition: HortenDraggableDefinition,
    epic: Epic,
    reducer: Reducer,
    alias: Alias,
    type: HortenType,
    defaultState: HortenDraggableDefaultState
}



export const createHortenDraggableModel = createHortenModel({
    moveIndices: createHaldenAction("MOVE_INDICES"),
    copyIndices: createHaldenAction("COPY_INDICES"),
    setMoving: createHaldenAction("SET_MOVING"),
    setSelected: createHaldenAction("SET_SELECTED"),
    onDragStarted: createHaldenAction("DRAG_STARTED"),
    onDragEnded: createHaldenAction("DRAG_ENDED"),
    toggleSelection: createHaldenAction("TOGGLE_SELECTION"),
    toggleSelectionInGroup: createHaldenAction("TOGGLE_SELECTION_IN_GROUP"),
})

export const createHortenDraggableHelpers = createHortenHelpers()

export const createHortenDraggableSelectors = createHortenSelectors({
    getData: createHaldenSelector("data"),
    getMoving: createHaldenSelector("moving"),
    getSelected: createHaldenSelector("selected")
})


export const createHortenDraggableEpic = createHortenEpic((model: HortenDraggableModel, selectors: HortenDraggableSelectors, helpers, definition: HortenDraggableDefinition) => ({
    onDragStarted: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.onDragStarted.request),
            mergeMap(action => {
                const start = action.payload
                const id: string = start.draggableId;
                const selectedTaskIds = selectors.getSelected(state$.value)

                const selected: ?Id = selectedTaskIds.find(
                    (taskId: Id): boolean => taskId === id,
                );

                // if dragging an item that is not selected - unselect all items
                if (!selected) {
                    return [model.setSelected.request([])];
                }
                else return [model.setMoving.request(id)]
            })
        )
    ),
    onDragEnded: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.onDragEnded.request),
            mergeMap(action => {
                const result = action.payload
                const destination: ?DraggableLocation = result.destination;
                const source: DraggableLocation = result.source;

                // nothing to do
                if (!destination || result.reason === 'CANCEL') {
                    return [model.setMoving.request(null)]
                }

                return [model.setMoving.request(null),
                        model.moveIndices.request({source: source,destination: destination})] // Move Indices will be on table not on other stuff



            })
        )
    ),
    onToggleSelection: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.toggleSelection.request),
            mergeMap(action => {
                const taskId = action.payload
                const selectedTaskIds: Id[] = selectors.getSelected(state$.value);
                const wasSelected: boolean = selectedTaskIds.includes(taskId);

                const newTaskIds: Id[] = (() => {
                    // Item was not previously selected
                    // now will be the only selected item
                    if (!wasSelected) {
                        return [taskId];
                    }

                    // Item was part of a selected group
                    // will now become the only selected item
                    if (selectedTaskIds.length > 1) {
                        return [taskId];
                    }

                    // task was previously selected but not in a group
                    // we will now clear the selection
                    return [];
                })();

                return [model.setSelected.request(newTaskIds)]
            })
        )
    ),
    onToggleSelectionInGroup: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.toggleSelectionInGroup.request),
            mergeMap(action => {
                const taskId = action.payload
                const selectedTaskIds: Id[] = selectors.getSelected(state$.value);
                const index: number = selectedTaskIds.indexOf(taskId);

                // if not selected - add it to the selected items
                if (index === -1) {
                    return [model.setSelected.request([...selectedTaskIds, taskId])];
                }

                // it was previously selected and now needs to be removed from the group
                const shallow: Id[] = [...selectedTaskIds];
                shallow.splice(index, 1);
                return [model.setSelected.request(shallow)];
            })
        )
    ),
    onMoveSuccess: createHaldenEpic((action$, state$) =>
        action$.pipe(
            ofType(model.moveIndices.success),
            mergeMap(action => {
                return [model.setSelected.request([])];
            })
        )
    ),


}))

const defaultState = {
    moving: null,
    selected: []


};

export const createHortenDraggableReducer = createHortenReducer((model: HortenDraggableModel) => (
    {

        [model.moveIndices.success]: (state, action) => {
            return { ...state, moved: true};
        },
        [model.setMoving.request]: (state, action) => {
            return { ...state, moving: action.payload};
        },
        [model.setSelected.request]: (state, action) => {
            console.log(action.payload)
            return { ...state, selected: action.payload};
        },
    })
);

export function createHortenDraggable(definition: HortenDraggableDefinition): ((Alias) => HortenDraggable) {
    let modelCreator = createHortenDraggableModel;
    let selectorsCreator = createHortenDraggableSelectors;
    let helperCreator = createHortenDraggableHelpers;
    let epicCreator = createHortenDraggableEpic;
    let reducerCreator = createHortenDraggableReducer;
    let sendDefinition = {...defaultDefinition,...definition}
    return createHorten2(sendDefinition, modelCreator, selectorsCreator, helperCreator, epicCreator, reducerCreator, defaultState)
}