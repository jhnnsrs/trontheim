import {Button} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {DisplayWatcherStavanger} from "./index";

class StartButton extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                <Button size="sm" outline  onClick={() => this.props.start()}> Start Flow</Button>
                {this.props.display ? this.props.display.name : "nothing"}
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: DisplayWatcherStavanger) => ({
    display: stavanger.display.selectors.getData
});

const mapStavangerToDispatch  = (stavanger: DisplayWatcherStavanger) =>  ({
    start: () => stavanger.node.model.dynamic("START").request({}),
    startRandom: () => stavanger.node.model.dynamic("START_RANDOM").request({})
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(StartButton);