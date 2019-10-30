import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Card, Col, Container, Row} from "reactstrap";
import {experimentStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import Samples from "./smartcomponents/Samples";
import Animals from "./smartcomponents/Animals";
import SampleDetailCard from "./smartcomponents/SampleDetailCard";
import ExperimentDetailCard from "./smartcomponents/ExperimentDetailCard";
import ExperimentalGroups from "./smartcomponents/ExperimentalGroups";
import SeperatingLine from "../generics/SeperatingLine";
import ExperimentDescription from "./smartcomponents/ExperimentDescription";

export class Experiment extends Component {

    render() {
        console.log("Rerender Major Template")
        return (
            <Container id="test">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <ExperimentDetailCard/>
                                <SampleDetailCard/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <ExperimentDescription/>
                                <SeperatingLine name={"Groups"}/>
                                <ExperimentalGroups/>
                                <SeperatingLine name={"Animals"}/>
                                <Animals/>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(experimentStavanger)(orchestraterEpic)(Experiment)("experiment",rootStavanger);
