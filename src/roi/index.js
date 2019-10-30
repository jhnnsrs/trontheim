import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Card, Col, Container, Row} from "reactstrap";
import {roiStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import Transformations from "./smartcomponents/Transformations";
import RoiDetailCard from "./smartcomponents/RoiDetailCard";
import VolumeDatas from "./smartcomponents/VolumeDatas";
import ClusterData from "./smartcomponents/ClusterData";

export class Roi extends Component {

    render() {
        return (
            <Container id="test">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <RoiDetailCard/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <Transformations/>
                                <VolumeDatas/>
                                <ClusterData/>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}

// dynamic:
export  default connectOpera(roiStavanger)(orchestraterEpic)(Roi)("roi",rootStavanger);
