import React from "react";
import {Card, Container} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {RepresentationSelector} from "./index";

const SelectionShower = (props) => <Container>
    Filtered By
    {props.sample && <Card>{props.sample.name}</Card>}

</Container>


const mapStavangerToProps = (stavanger: RepresentationSelector) => ({
    sample: stavanger.sample.selectors.getData,
});


const mapStavangerToDispatch  = (stavanger: RepresentationSelector) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SelectionShower);
