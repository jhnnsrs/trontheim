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
    hasPopped: stavanger.edge.selectors.hasPopped,
    edge: stavanger.edge.selectors.getModel
});

const mapStavangerToDispatch  = (stavanger: TwoDShowStavanger) =>  ({
    start: (node) => stavanger.edge.model.pop.request(node),
    unpop: (node) => stavanger.edge.model.unpop.request(node),
    alienate: (node) => stavanger.edge.model.alienate.request(node),
    homecoming: (node) => stavanger.edge.model.homecoming.request(node),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(StartButton);