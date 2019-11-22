import React from "react";
import {Card, Container} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {ExperimentSelector} from "./index";

const SelectionShower = (props) => <Container>
    Filtered By
    {props.user && <Card>{props.user.username}</Card>}

</Container>


const mapStavangerToProps = (stavanger: ExperimentSelector) => ({
    user: stavanger.user.selectors.getData,
});


const mapStavangerToDispatch  = (stavanger: ExperimentSelector) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SelectionShower);
