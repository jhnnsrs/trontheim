import {Button} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {ForeignMasking} from "./index";

class ExperimentSelector extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                Please Pop Me
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: ForeignMasking) => ({
});

const mapStavangerToDispatch  = (stavanger: ForeignMasking) =>  ({
    start: () => stavanger.page.model.dynamic("IMPULSE").request({}),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ExperimentSelector);