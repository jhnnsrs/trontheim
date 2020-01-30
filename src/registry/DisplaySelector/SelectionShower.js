import React from "react";
import {Card, Container} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {DisplaySelectorStavanger} from "./index";

const SelectionShower = (props) => <Container>
    Filtered By
    {props.sample && <Card>{props.sample.name}</Card>}

</Container>


const mapStavangerToProps = (stavanger: DisplaySelectorStavanger) => ({
    sample: stavanger.sample.selectors.getData,
});


const mapStavangerToDispatch  = (stavanger: DisplaySelectorStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SelectionShower);
