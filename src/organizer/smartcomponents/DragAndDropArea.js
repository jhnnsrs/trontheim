// @flow
import React, {Component} from 'react';
import {connectInstrument} from "../../alta/react";
import type {OrganizerStavanger} from "../stavanger";
import {DragDropContext, DragStart, DropResult} from "react-beautiful-dnd";


class DragAndDropArea extends Component {
    state: State = {
        selectedItemIds: [],
        draggingItemId: null,
    };

    componentDidMount() {
        window.addEventListener('click', this.onWindowClick);
        window.addEventListener('keydown', this.onWindowKeyDown);
        window.addEventListener('touchend', this.onWindowTouchEnd);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.onWindowClick);
        window.removeEventListener('keydown', this.onWindowKeyDown);
        window.removeEventListener('touchend', this.onWindowTouchEnd);
    }

    onDragStart = (start: DragStart) => {

        this.props.dragStarted(start)
    };

    onDragEnd = (result: DropResult) => {
        this.props.dragEnded(result)
    };


    onWindowKeyDown = (event: KeyboardEvent) => {
        if (event.defaultPrevented) {
            return;
        }

        if (event.key === 'Escape') {
            this.unselectAll();
        }
    };

    onWindowClick = (event: KeyboardEvent) => {
        if (event.defaultPrevented) {
            return;
        }
        this.unselectAll();
    };

    onWindowTouchEnd = (event: TouchEvent) => {
        if (event.defaultPrevented) {
            return;
        }
        this.unselectAll();
    };



    unselectAll = () => {
        this.props.setSelected([])
    };

    render() {
        return (
            <DragDropContext
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
            >
                    {this.props.children}
            </DragDropContext>
        );
    }
}

const mapStavangerToProps = (stavanger: OrganizerStavanger) => ({
});

const mapStavangerToDispatch  = (stavanger: OrganizerStavanger) =>  ({
    moveIndices: (indices,source,destination) => stavanger.draggable.model.moveIndices.request({indices: indices, source: source, destination: destination}),
    copyIndices: (indices,source,destination) => stavanger.draggable.model.copyIndices.request({indices: indices, source: source, destination: destination}),
    setMoving: (indices) => stavanger.draggable.model.setMoving.request(indices),
    setSelected: (indices) => stavanger.draggable.model.setSelected.request(indices),
    dragStarted: (item) => stavanger.draggable.model.onDragStarted.request(item),
    dragEnded: (item) => stavanger.draggable.model.onDragEnded.request(item),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(DragAndDropArea);
