import {Button, ButtonGroup, CardBody, CardText} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import Mold from "../../alta/react/FinalMold";
import type {ImpulsorStavanger} from "./index";
import {Field} from "react-final-form";

class ExperimentSelector extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                <Button size="sm" outline  onClick={() => this.props.start()}> Start Flow</Button>
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: ImpulsorStavanger) => ({
});

const mapStavangerToDispatch  = (stavanger: ImpulsorStavanger) =>  ({
    start: () => stavanger.page.model.dynamic("IMPULSE").request({}),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ExperimentSelector);