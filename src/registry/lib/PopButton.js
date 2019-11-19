import {Button} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {HortenGraph} from "../../alta/horten/graph";
import type {HortenRegistry} from "../../alta/horten/registry";
import type {HortenNode} from "../../alta/horten/node";

export interface GraphStavanger {
    graph: HortenGraph,
    registry: HortenRegistry
}


export interface NodeStavanger {
    parent: GraphStavanger,
    node: HortenNode
}


class StartButton extends Component<any,any> {
    render() {

        let type = this.props.type
        return (
            <React.Fragment>
                {(type === undefined) && <Button size="sm" outline  onClick={() => this.props.start()}> Pop</Button>}
                {(type === "pop") && <Button size="sm" outline  onClick={() => this.props.unpop()}>Unpop </Button>}
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: NodeStavanger) => ({
    type: stavanger.parent.graph.selectors.getNodeType(stavanger.node.alias),
    node: stavanger.node.selectors.getModel
});

const mapStavangerToDispatch  = (stavanger: NodeStavanger) =>  ({
    start: () => stavanger.node.model.pop.request(),
    unpop: () => stavanger.node.model.unpop.request(),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(StartButton);