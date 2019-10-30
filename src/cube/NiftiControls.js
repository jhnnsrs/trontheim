
import React, {Component} from "react";
import {Button, ButtonGroup, Container} from "reactstrap";

import {connectInstrument} from "../alta/react";
import type {CubeStavanger} from "./stavanger";
import {orientations, conventions, angles} from "./models"

const NiftiControls = ({ zValue, setLowerLimit, setUpperLimit,lowerLimit,upperLimit , postSlice, setOrientation, setConvention, setAngle}) =>
    <Container className="text-center mt-2">
        <ButtonGroup>
            <Button outline onClick={() => setLowerLimit()}> Set Lower </Button>
            <Button> {lowerLimit} --- {zValue}  --- {upperLimit}</Button>
            <Button outline onClick={() => setUpperLimit()}> Set Upper </Button>

        </ButtonGroup>
        <br/>
        <Button onClick={postSlice}> Post Slice </Button>
        <ButtonGroup>{orientations.map( orientation => <Button onClick={() => setOrientation(orientation)} key={orientation}>{orientation}</Button>)}</ButtonGroup><br/>
        <ButtonGroup>{conventions.map( convention => <Button onClick={() => setConvention(convention)} key={convention}>{convention}</Button>)}</ButtonGroup><br/>
        <ButtonGroup>{angles.map( angle => <Button onClick={() => setAngle(angle)} key={angle}>{angle}</Button>)}</ButtonGroup><br/>
    </Container>



const mapStavangerToProps = (stavanger: CubeStavanger) => ({
    zValue: stavanger.cube.selectors.getZValue,
    lowerLimit: stavanger.cube.selectors.getLowerLimit,
    upperLimit: stavanger.cube.selectors.getUpperLimit,
});

const mapStavangerToDispatch  = (stavanger: CubeStavanger) =>  ({
    setLowerLimit: () => stavanger.cube.model.setLowerLimit.request({}),
    setUpperLimit: () => stavanger.cube.model.setUpperLimit.request({}),
    postSlice: () => stavanger.cube.model.postSlice.request({}),
    setOrientation: (orientation) => stavanger.cube.model.setOrientation.request(orientation),
    setConvention: (convention) => stavanger.cube.model.setConvention.request(convention),
    setAngle: (angle) => stavanger.cube.model.setAngle.request(angle),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NiftiControls);
