import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Col, Container, Row} from "reactstrap";
import {sampleStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import Representations from "./smartcomponents/Representations";
import SampleDetailCard from "./smartcomponents/SampleDetailCard";
import Flows from "./smartcomponents/Flows";

export class Experiment extends Component {

    render() {
        return (
            <Container id="test">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <SampleDetailCard/>
                                <Flows/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <Representations/>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(sampleStavanger)(orchestraterEpic)(Experiment)("sample",rootStavanger);
