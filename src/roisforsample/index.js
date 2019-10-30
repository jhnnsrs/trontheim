import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Card, Col, Container, Row} from "reactstrap";
import {roiForSampleStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import SampleDetailCard from "./smartcomponents/SampleDetailCard";
import RoisForDisplay from "./smartcomponents/Rois";

export class Experiment extends Component {

    render() {
        return (
            <Container id="test">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <SampleDetailCard/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <RoisForDisplay/>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(roiForSampleStavanger)(orchestraterEpic)(Experiment)("roisforsample",rootStavanger);
