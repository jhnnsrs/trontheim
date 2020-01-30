import React from "react";
import {Card, Container} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {ExperimentSelector} from "./index";

const SelectionShower = (props) => <Container>
    Filtered By
    {props.user && <Card>{props.user.username}</Card>}
    {props.representation && <Card>{props.representation.name}</Card>}
    {props.sample && <Card>{props.sample.name}</Card>}

</Container>


const mapStavangerToProps = (stavanger: ExperimentSelector) => ({
    user: stavanger.user.selectors.getData,
    sample: stavanger.sample.selectors.getData,
    representation: stavanger.representation.selectors.getData,
});


const mapStavangerToDispatch  = (stavanger: ExperimentSelector) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SelectionShower);
