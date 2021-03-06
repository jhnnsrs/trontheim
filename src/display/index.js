import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Col, Container, Row} from "reactstrap";
import {displayStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import Transformations from "./smartcomponents/Transformations";
import DisplayDetailCard from "./smartcomponents/DisplayDetailCard";
import Rois from "./smartcomponents/Rois";
import Stage from "./smartcomponents/Stage";

export class Experiment extends Component {

    render() {
        return (
            <Container id="test">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <DisplayDetailCard/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <Stage/>
                                <Rois/>
                                <Transformations/>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(displayStavanger)(orchestraterEpic)(Experiment)("display",rootStavanger);
