import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Col, Container, Row} from "reactstrap";
import {experimentalGroupStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import Samples from "./smartcomponents/Samples";
import SampleDetailCard from "./smartcomponents/SampleDetailCard";
import ExperimentalGroupDetailCard from "./smartcomponents/ExperimentalGroupDetailCard";

export class Experiment extends Component {

    render() {
        console.log("Rerender Major Template")
        return (
            <Container id="test">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <ExperimentalGroupDetailCard/>
                                <SampleDetailCard/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <Samples/>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(experimentalGroupStavanger)(orchestraterEpic)(Experiment)("experimentalGroup",rootStavanger);
