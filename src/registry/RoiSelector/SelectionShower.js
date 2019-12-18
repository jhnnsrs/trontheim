import React from "react";
import {Badge, Card, Container} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {RoiSelectorStavanger} from "./index";

const SelectionShower = (props) => <h2>
    Filters:
    {props.sample && <Badge>Sample {props.sample.id}</Badge>}
    {props.display && <Badge>Display {props.display.id}</Badge>}

</h2>


const mapStavangerToProps = (stavanger: RoiSelectorStavanger) => ({
    sample: stavanger.sample.selectors.getData,
    display: stavanger.display.selectors.getData,
});


const mapStavangerToDispatch  = (stavanger: RoiSelectorStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SelectionShower);
