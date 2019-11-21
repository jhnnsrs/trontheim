import React from "react";
import {Card, Container} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {BioImageSelector} from "./index";

const SelectionShower = (props) => <Container>
    Filtered By
    {props.locker && <Card>{props.locker.name}</Card>}

</Container>


const mapStavangerToProps = (stavanger: BioImageSelector) => ({
    locker: stavanger.locker.selectors.getData,
});


const mapStavangerToDispatch  = (stavanger: BioImageSelector) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SelectionShower);
