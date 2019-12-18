import React from "react";
import {Card, Container} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {SampleSelectorStavanger} from "./index";

const SelectionShower = (props) => <Container>
    Filtered By
    {props.locker && <Card>{props.locker.name}</Card>}

</Container>


const mapStavangerToProps = (stavanger: SampleSelectorStavanger) => ({
    locker: stavanger.locker.selectors.getData,
});


const mapStavangerToDispatch  = (stavanger: SampleSelectorStavanger) =>  ({
    selectItem: (item) => stavanger.samples.model.selectItem.request(item),
    deleteItem: (item) => stavanger.samples.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SelectionShower);
