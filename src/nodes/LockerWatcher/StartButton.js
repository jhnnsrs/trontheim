import {Button} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {LockerWatcherStavanger} from "./index";

class StartButton extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                <Button size="sm" outline  onClick={() => this.props.start()}> Start Flow</Button>
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: LockerWatcherStavanger) => ({
});

const mapStavangerToDispatch  = (stavanger: LockerWatcherStavanger) =>  ({
    start: () => stavanger.edge.model.dynamic("START").request({}),
    startRandom: () => stavanger.edge.model.dynamic("START_RANDOM").request({})
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(StartButton);