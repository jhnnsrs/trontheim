import {Button} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";
import type {NodeStavanger} from "./types";
import {THIS_ROOT_URL} from "../../constants/endpoints";


class StartButton extends Component<any,any> {
    render() {
        let type = this.props.type
        console.log("rerendered")
        return (
            <React.Fragment>
                {(type.location === "local") && <Button size="sm" outline  onClick={() => this.props.start()}> Pop</Button>}
                {(type.location === "pop") && <>
                        <Button size="sm" outline  onClick={() => this.props.unpop()}>{type.location} </Button>
                        <ButtonToNavigate outside={true} to={THIS_ROOT_URL + "/external/" + type.external}>{type.external}</ButtonToNavigate>
                    </>}
                {(type.location === "external") && ""}
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