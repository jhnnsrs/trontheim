// @flow
import React, {Component} from 'react';
import styled from 'styled-components'
import {borderRadius, grid} from './constants';
import type {Id, Task as TaskType} from './types';
import {Draggable, DraggableProvided, DraggableStateSnapshot} from "react-beautiful-dnd";

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const primaryButton = 0;

type Props = {|
    task: TaskType,
    index: number,
    isSelected: boolean,
    isGhosting: boolean,
    selectionCount: number,
    toggleSelection: (taskId: Id) => void,
    toggleSelectionInGroup: (taskId: Id) => void,
    multiSelectTo: (taskId: Id) => void,
|};

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


type GetBackgroundColorArgs = {|
    isSelected: boolean,
    isDragging: boolean,
    isGhosting: boolean,
|};

const getBackgroundColor = ({
                                isSelected,
                                isGhosting,
                            }: GetBackgroundColorArgs): string => {
    if (isGhosting) {
        return colors.N10;
    }

    if (isSelected) {
        return colors.B50;
    }

    return colors.N10;
};

const getColor = ({ isSelected, isGhosting }): string => {
    if (isGhosting) {
        return 'darkgrey';
    }
    if (isSelected) {
        return colors.B200;
    }
    return colors.N900;
};

const Container = styled.div`
  background-color: ${props => getBackgroundColor(props)};
  color: ${props => getColor(props)};
  padding: ${grid}px;
  margin-bottom: ${grid}px;
  border-radius: ${borderRadius}px;
  font-size: 18px;
  border: 1px solid ${colors.N90};
  ${props =>
    props.isDragging ? `box-shadow: 2px 2px 1px ${colors.N90};` : ''} ${props =>
    props.isGhosting
        ? 'opacity: 0.8;'
        : ''}

  /* needed for SelectionCount */
  position: relative;

  /* avoid default outline which looks lame with the position: absolute; */
  &:focus {
    outline: none;
    border-color: ${colors.N200};
  }
`;
/* stylelint-disable block-no-empty */
const Content = styled.div``;
/* stylelint-enable */
const size: number = 30;

const SelectionCount = styled.div`
  right: -${grid}px;
  top: -${grid}px;
  color: ${colors.N0};
  background: ${colors.N200};
  border-radius: 50%;
  height: ${size}px;
  width: ${size}px;
  line-height: ${size}px;
  position: absolute;
  text-align: center;
  font-size: 0.8rem;
`;

const keyCodes = {
    enter: 13,
    escape: 27,
    arrowDown: 40,
    arrowUp: 38,
    tab: 9,
};

export default class Task extends Component<Props> {
    onKeyDown = (
        event: KeyboardEvent,
        provided: DraggableProvided,
        snapshot: DraggableStateSnapshot,
    ) => {
        if (provided.dragHandleProps) {
            provided.dragHandleProps.onKeyDown(event);
        }

        if (event.defaultPrevented) {
            return;
        }

        if (snapshot.isDragging) {
            return;
        }

        if (event.keyCode !== keyCodes.enter) {
            return;
        }

        // we are using the event for selection
        event.preventDefault();

        this.performAction(event);
    };

    // Using onClick as it will be correctly
    // preventing if there was a drag
    onClick = (event: MouseEvent) => {
        if (event.defaultPrevented) {
            return;
        }

        if (event.button !== primaryButton) {
            return;
        }

        // marking the event as used
        event.preventDefault();

        this.performAction(event);
    };

    onTouchEnd = (event: TouchEvent) => {
        if (event.defaultPrevented) {
            return;
        }

        // marking the event as used
        // we would also need to add some extra logic to prevent the click
        // if this element was an anchor
        event.preventDefault();
        this.props.toggleSelectionInGroup(this.props.data.id);
    };

    // Determines if the platform specific toggle selection in group key was used
    wasToggleInSelectionGroupKeyUsed = (event: MouseEvent | KeyboardEvent) => {
        const isUsingMac = navigator.platform.toUpperCase().indexOf('MAC') > -1;
        return isUsingMac ? event.metaKey : event.ctrlKey;
    };

    // Determines if the multiSelect key was used
    wasMultiSelectKeyUsed = (event: MouseEvent | KeyboardEvent) => event.shiftKey;

    performAction = (event: MouseEvent | KeyboardEvent) => {
        const {
            data,
            toggleSelection,
            toggleSelectionInGroup,
        } = this.props;

        if (this.wasToggleInSelectionGroupKeyUsed(event)) {
            toggleSelectionInGroup(data.id);
            return;
        }

        toggleSelection(data.id);
    };

    render() {
        const data: TaskType = this.props.data;
        const meta: TaskType = this.props.meta;
        const index: number = this.props.index;
        const isSelected: boolean = this.props.isSelected;
        const selectionCount: number = this.props.selectionCount;
        const isGhosting: boolean = this.props.isGhosting;
        return (
            <Draggable draggableId={data.id} index={index}>
                {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
                    const shouldShowSelection: boolean =
                        snapshot.isDragging && selectionCount > 1;

                    return (
                        <Container
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={this.onClick}
                            onTouchEnd={this.onTouchEnd}
                            onKeyDown={(event: KeyboardEvent) =>
                                this.onKeyDown(event, provided, snapshot)
                            }
                            isDragging={snapshot.isDragging}
                            isSelected={isSelected}
                            isGhosting={isGhosting}
                        >
                            <Content>{data.name}</Content>
                            {shouldShowSelection ? (
                                <SelectionCount>{selectionCount}</SelectionCount>
                            ) : null}
                        </Container>
                    );
                }}
            </Draggable>
        );
    }
}
