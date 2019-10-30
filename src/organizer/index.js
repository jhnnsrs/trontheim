import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Col, Container, Row} from "reactstrap";
import {organizerStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import ExperimentDetailCard from "./smartcomponents/ExperimentDetailCard";
import Interface from "./smartcomponents/Interface";

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
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <Interface/>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(organizerStavanger)(orchestraterEpic)(Experiment)("organizer",rootStavanger);
