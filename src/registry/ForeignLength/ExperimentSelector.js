import {Button} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {ForeignLength} from "./index";

class ExperimentSelector extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                This node is a Foreign Node and should always be popped
                <Button size="sm" outline  onClick={() => this.props.start()}> Start Flow</Button>
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: ForeignLength) => ({
});

const mapStavangerToDispatch  = (stavanger: ForeignLength) =>  ({
    start: () => stavanger.page.model.dynamic("IMPULSE").request({}),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ExperimentSelector);