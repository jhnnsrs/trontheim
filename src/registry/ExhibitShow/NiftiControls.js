import React from "react";
import {Button, ButtonGroup, Container} from "reactstrap";

import {connectInstrument} from "../../alta/react";
import type {ExhibitShowStavanger} from "./index";

const NiftiControls = ({ zValue, setLowerLimit, setUpperLimit,lowerLimit,upperLimit , postSlice}) =>
    <Container className="text-center mt-2">
        <ButtonGroup>
            <Button outline onClick={() => setLowerLimit()}> Set Lower </Button>
            <Button> {lowerLimit} --- {zValue}  --- {upperLimit}</Button>
            <Button outline onClick={() => setUpperLimit()}> Set Upper </Button>

        </ButtonGroup>
        <br/>
        <Button onClick={postSlice}> Post Slice </Button>
    </Container>



const mapStavangerToProps = (stavanger: ExhibitShowStavanger) => ({
    zValue: stavanger.cube.selectors.getZValue,
    lowerLimit: stavanger.cube.selectors.getLowerLimit,
    upperLimit: stavanger.cube.selectors.getUpperLimit,
});

const mapStavangerToDispatch  = (stavanger: ExhibitShowStavanger) =>  ({
    setLowerLimit: () => stavanger.cube.model.setLowerLimit.request({}),
    setUpperLimit: () => stavanger.cube.model.setUpperLimit.request({}),
    postSlice: () => stavanger.cube.model.postSlice.request({}),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NiftiControls);
