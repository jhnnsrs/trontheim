import {Button, ButtonGroup, CardBody, CardText, Container} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import Form from "../../alta/react/FinalMold";
import type {SampleFromNameUpdaterStavanger, SliceLineTransformer} from "./index";
import {Field} from "react-final-form";

class LineRectComponent extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                {this.props.sample && <Container>FileNameTo Parse: {this.props.sample.name}</Container>}
             </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: SampleFromNameUpdaterStavanger) => ({
    sample: stavanger.sample.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: SampleFromNameUpdaterStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LineRectComponent);