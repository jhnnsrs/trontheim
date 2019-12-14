import React from "react";
import {Card, Container} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {RoiSelectorStavanger} from "./index";

const SelectionShower = (props) => <Container>
    Filtered By
    {props.sample && <Card>{props.sample.name}</Card>}
    {props.roi && <Card>{props.roi.name}</Card>}

</Container>


const mapStavangerToProps = (stavanger: RoiSelectorStavanger) => ({
    sample: stavanger.sample.selectors.getData,
    display: stavanger.display.selectors.getData,
});


const mapStavangerToDispatch  = (stavanger: RoiSelectorStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SelectionShower);
