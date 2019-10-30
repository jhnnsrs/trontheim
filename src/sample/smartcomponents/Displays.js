import React, {Component} from "react";
import type {SampleStavanger} from "../stavanger";
import {Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import DisplaysForRepresentation from "./DisplaysForRepresentation";

class Displays extends Component {

    render() {
        const {displays} = this.props;
        if (displays.data) {
            return (
                <React.Fragment>
                {displays.data.map((display, index) =>
                        <Card className="mt-2" key={display.data.id} onClick={() => this.props.selectRepresentation(display)}>
                            <CardBody>
                                <CardTitle>{display.data.id}</CardTitle>
                                <CardSubtitle>Representation {display.data.representation}</CardSubtitle>
                                <DisplaysForRepresentation representation={display}/>
                            </CardBody>

                        </Card>)}
                </React.Fragment>
            );
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: SampleStavanger) => ({
    displays: stavanger.displays.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: SampleStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Displays);
