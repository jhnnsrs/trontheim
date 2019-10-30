import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Card, Col, Container, Row} from "reactstrap";
import {representationStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import DisplayList from "./smartcomponents/DisplayList";
import RepresentationDetailCard from "./smartcomponents/RepresentationDetailCard";
import ExhibitList from "./smartcomponents/ExhibitList";


export class Representation extends Component {

    render() {
        return (
            <Container id="representation">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <RepresentationDetailCard/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <DisplayList/>
                                <ExhibitList/>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(representationStavanger)(orchestraterEpic)(Representation)("representation",rootStavanger);
