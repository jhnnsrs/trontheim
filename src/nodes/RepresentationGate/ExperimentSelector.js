import {Button} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {RepresentationGateStavanger} from "./index";

class ExperimentSelector extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                <Button size="sm" outline  onClick={() => this.props.start()}> Open Gate</Button>
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: RepresentationGateStavanger) => ({
});

const mapStavangerToDispatch  = (stavanger: RepresentationGateStavanger) =>  ({
    start: () => stavanger.page.model.dynamic("GATE").request({}),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ExperimentSelector);