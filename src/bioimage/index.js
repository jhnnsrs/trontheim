import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Card, Col, Container, Row} from "reactstrap";
import {bioImageStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import BioseriesList from "./smartcomponents/BioseriesList";
import BioImageDetailCard from "./smartcomponents/BioImageDetailCard";


export class Bioimage extends Component {

    render() {
        return (
            <Container id="bioimage">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <BioImageDetailCard/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <BioseriesList/>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(bioImageStavanger)(orchestraterEpic)(Bioimage)("bioimage",rootStavanger);
