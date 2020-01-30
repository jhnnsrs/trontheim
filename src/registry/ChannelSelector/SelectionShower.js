import React from "react";
import {Card, Container} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {ChannelSelector} from "./index";

const SelectionShower = (props) => <Container>
    Filtered By
    {props.locker && <Card>{props.locker.name}</Card>}

</Container>


const mapStavangerToProps = (stavanger: ChannelSelector) => ({
    representation: stavanger.representation.selectors.getData,
});


const mapStavangerToDispatch  = (stavanger: ChannelSelector) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SelectionShower);
