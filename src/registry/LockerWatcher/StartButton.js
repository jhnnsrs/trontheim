import {Button} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {LockerWatcherStavanger} from "./index";

class StartButton extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                <Button size="sm" outline  onClick={() => this.props.start()}> Start Flow</Button>
                {this.props.locker ? this.props.locker.name : "nothing"}
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: LockerWatcherStavanger) => ({
    locker: stavanger.locker.selectors.getData
});

const mapStavangerToDispatch  = (stavanger: LockerWatcherStavanger) =>  ({
    start: () => stavanger.node.model.dynamic("START").request({}),
    startRandom: () => stavanger.node.model.dynamic("START_RANDOM").request({})
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(StartButton);