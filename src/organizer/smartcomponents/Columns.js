// @flow
import React, { Component } from 'react';
import memoizeOne from 'memoize-one';
import type {OrganizerStavanger} from "../stavanger";
import {connectInstrument} from "../../alta/react";
import type {Stavanger} from "../../alta/stavanger";
import type {HortenTable} from "../../alta/horten/table";
import {Droppable, Id} from "react-beautiful-dnd";
import Item from "./Item";
import styled from 'styled-components'
import type {Column as ColumnType} from "./multi-drag/types";
import {borderRadius, grid} from "./constants";

const colors = {
    N10: "#1287f8",
    N0: "#79fb5e",
    B50: "#a946df",
    N200: "#ae3411",
    B200: "#b117d2",
    N90: "#581990",
    N900: "#bc2880",
    N100: "#e0c9ee",
    N50: "#63573e",
}


type Props = {|
    column: ColumnType,
    tasks: TaskType[],
    selectedTaskIds: Id[],
    draggingTaskId: ?Id,
    toggleSelection: (taskId: Id) => void,
    toggleSelectionInGroup: (taskId: Id) => void,
    multiSelectTo: (taskId: Id) => void,
|};

const Container = styled.div`
  width: 300px;
  margin: ${grid}px;
  border-radius: ${borderRadius}px;
  border: 1px solid ${colors.N100};
  background-color: ${colors.N50};

  /* we want the column to take up its full height */
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-weight: bold;
  padding: ${grid}px;
`;

const TaskList = styled.div`
  padding: ${grid}px;
  min-height: 200px;
  flex-grow: 1;
  transition: background-color 0.2s ease;
  ${props => (props.isDraggingOver ? `background-color: ${colors.N200}` : '')};
`;


;

const getSelectedMap = memoizeOne((selectedTaskIds: Id[]) =>
    selectedTaskIds.reduce((previous: TaskIdMap, current: Id): TaskIdMap => {
        previous[current] = true;
        return previous;
    }, {}),
);

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'grey',
    padding: 2,
    width: 250,
});



export  class Column extends Component<Props> {

    toggleSelection = (taskId: Id) => {
        this.props.toggleSelection(taskId)
    };

    toggleSelectionInGroup = (taskId: Id) => {
        this.props.toggleSelectionInGroup(taskId)
    };




    render() {
        const tableID = this.props.tableID
        const list = this.props.list
        const selectedItemIds: Id[] = this.props.selectedItemIds;
        const dragginItemId: ?Id = this.props.draggingItemId;
        return (
            <Container>
                <Title>{tableID}</Title>
                <Droppable droppableId={tableID}>
                    {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                        <TaskList
                            ref={provided.innerRef}
                            isDraggingOver={snapshot.isDraggingOver}
                            {...provided.droppableProps}
                        >
                            {list.map((item: any, index: number) => {
                                const isSelected: boolean = Boolean(
                                    getSelectedMap(selectedItemIds)[item.data.id],
                                );
                                const isGhosting: boolean =
                                    isSelected &&
                                    Boolean(dragginItemId) &&
                                    dragginItemId !== item.data.id;
                                return (
                                    <Item
                                        data={item.data}
                                        meta={item.meta}
                                        index={index}
                                        key={item.data.id}
                                        isSelected={isSelected}
                                        isGhosting={isGhosting}
                                        selectionCount={selectedItemIds.length}
                                        toggleSelection={(id) => this.props.toggleSelection(id)}
                                        toggleSelectionInGroup={(id) => this.props.toggleSelectionInGroup(id)}
                                        component = {this.props.children}
                                    />
                                );
                            })}
                            {provided.placeholder}
                        </TaskList>
                    )}
                </Droppable>
            </Container>
        );
    }
}

export const ColumnBuilder = (accesor: (Stavanger) => HortenTable) => {

    const mapStavangerToProps = (stavanger: OrganizerStavanger) => ({
        tableID: (state) => accesor(stavanger).key,
        list: accesor(stavanger).selectors.getList,
        draggingItemId: stavanger.draggable.selectors.getMoving,
        selectedItemIds: stavanger.draggable.selectors.getSelected,

    });

    const mapStavangerToDispatch = (stavanger: OrganizerStavanger) => ({
        addToTable: (items) => accesor(stavanger).model.addToList(items),
        toggleSelection: (id) => stavanger.draggable.model.toggleSelection.request(id),
        toggleSelectionInGroup: (id) => stavanger.draggable.model.toggleSelectionInGroup.request(id),

    });


    return connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Column);
}