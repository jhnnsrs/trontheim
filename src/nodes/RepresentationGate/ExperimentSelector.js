import {Button, ButtonGroup, CardBody, CardText} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import Mold from "../../alta/react/FinalMold";
import type {RepresentationGateStavanger} from "./index";
import {Field} from "react-final-form";

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