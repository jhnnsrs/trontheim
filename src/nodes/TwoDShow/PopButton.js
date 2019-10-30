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
                {!this.props.hasPopped && <Button size="sm" outline  onClick={() => this.props.start()}> Pop</Button>}
                {this.props.hasPopped && <ButtonGroup>

                    <a href={"/nodepop/" + node.baseid + '/instance/' + node.instanceid + '/channel/' + this.props.hasPopped} target="_blank">Open</a>
                    <Button size="sm" outline  onClick={() => this.props.unpop()}>Unpop {this.props.hasPopped}</Button>
                </ButtonGroup>}
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: TwoDShowStavanger) => ({
    hasPopped: stavanger.edge.selectors.hasPopped,
    edge: stavanger.edge.selectors.getModel
});

const mapStavangerToDispatch  = (stavanger: TwoDShowStavanger) =>  ({
    start: () => stavanger.edge.model.pop.request({}),
    unpop: () => stavanger.edge.model.unpop.request({}),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(StartButton);