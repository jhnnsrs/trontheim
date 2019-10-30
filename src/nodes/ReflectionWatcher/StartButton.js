import {Button} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {ReflectionWatcherStavanger} from "./index";

class StartButton extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                <Button size="sm" outline  onClick={() => this.props.start()}> Start Flow</Button>
                <Button size="sm" outline  onClick={() => this.props.startRandom()}> Start Random</Button>
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: ReflectionWatcherStavanger) => ({
});

const mapStavangerToDispatch  = (stavanger: ReflectionWatcherStavanger) =>  ({
    start: () => stavanger.edge.model.dynamic("START").request({}),
    startRandom: () => stavanger.edge.model.dynamic("START_RANDOM").request({})
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(StartButton);