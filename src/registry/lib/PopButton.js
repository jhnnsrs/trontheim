import {Button} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {HortenGraph} from "../../alta/horten/graph";
import type {HortenRegistry} from "../../alta/horten/registry";
import type {HortenNode} from "../../alta/horten/node";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

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
                {(type.location === "local") ? <Button size="sm" outline  onClick={() => this.props.start()}> Pop</Button>
                : <>
                        <Button size="sm" outline  onClick={() => this.props.unpop()}>{type.location} </Button>
                        <ButtonToNavigate outside={true} to={"http://localhost:3000/external/" + type.external}>{type.external}</ButtonToNavigate>
                    </>}
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