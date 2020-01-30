import React, {Component} from 'react';
import {Card} from "reactstrap";

class NodeDrag extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}
                outline={true}
                draggable={true}
                onDragStart={event => {
                    event.dataTransfer.setData("storm-diagram-node", JSON.stringify(this.props.node));
                }}
            >
                {this.props.node.data.name}
            </Card>
        );
    }
}

export default NodeDrag


