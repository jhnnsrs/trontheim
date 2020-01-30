import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Col, Container, Row} from "reactstrap";
import {lockerStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import Bioimages from "./smartcomponents/Bioimages";
import LockerDetailCard from "./smartcomponents/LockerDetailCard";
import RepresentationDetailCard from "./smartcomponents/BioImageDetailCard";
import BioImageUploadCard from "./smartcomponents/BioImageUploadCard";
import Flows from "./smartcomponents/Flows";


export class Locker extends Component {

    render() {
        return (
            <Container id="locker">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <LockerDetailCard/>
                                <RepresentationDetailCard/>
                                <BioImageUploadCard/>
                                <Flows/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <Bioimages/>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(lockerStavanger)(orchestraterEpic)(Locker)("locker",rootStavanger);
