import {Button, ButtonGroup} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {TwoDShowStavanger} from "./index";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class StartButton extends Component<any,any> {
    render() {

        let node = this.props.edge
        return (
            <React.Fragment>
                {!this.props.hasAlien && <Button size="sm" outline  onClick={() => this.props.alienate(node)}> Alien</Button>}
                {this.props.hasAlien && <Button size="sm" outline  onClick={() => this.props.homecoming(node)}>Come Home </Button>}
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: TwoDShowStavanger) => ({
    hasAlien: stavanger.edge.selectors.hasAlien,
    edge: stavanger.edge.selectors.getModel
});

const mapStavangerToDispatch  = (stavanger: TwoDShowStavanger) =>  ({
    alienate: (node) => stavanger.edge.model.alienate.request(node),
    homecoming: (node) => stavanger.edge.model.homecoming.request(node),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(StartButton);