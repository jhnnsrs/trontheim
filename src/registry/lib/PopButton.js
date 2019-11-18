import {Button} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {TwoDShowStavanger} from "./index";

class StartButton extends Component<any,any> {
    render() {

        let node = this.props.edge
        return (
            <React.Fragment>
                {!this.props.hasPopped && <Button size="sm" outline  onClick={() => this.props.start(node)}> Pop</Button>}
                {this.props.hasPopped && <Button size="sm" outline  onClick={() => this.props.unpop(node)}>Unpop </Button>}
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: TwoDShowStavanger) => ({
    hasPopped: stavanger.node.selectors.hasPopped,
    edge: stavanger.node.selectors.getModel
});

const mapStavangerToDispatch  = (stavanger: TwoDShowStavanger) =>  ({
    start: (node) => stavanger.node.model.pop.request(node),
    unpop: (node) => stavanger.node.model.unpop.request(node),
    alienate: (node) => stavanger.node.model.alienate.request(node),
    homecoming: (node) => stavanger.node.model.homecoming.request(node),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(StartButton);