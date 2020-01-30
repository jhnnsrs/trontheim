import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Col, Container, Row} from "reactstrap";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import Bioimages from "./smartcomponents/Bioimages";
import LockerDetailCard from "./smartcomponents/LockerDetailCard";
import UserDetailCard from "./smartcomponents/UserDetailCard";
import {lockersStavanger} from "./stavanger";
import LockersList from "./smartcomponents/LockersList";
import Importers from "./smartcomponents/Importers";


export class Lockers extends Component {

    render() {
        return (
            <Container id="lockers">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <UserDetailCard/>
                                <LockerDetailCard/>
                                <Importers/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <Row>
                                <Col>
                                    <LockersList/>
                                </Col>
                                <Col>
                                    <Bioimages/>
                                </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(lockersStavanger)(orchestraterEpic)(Lockers)("imports",rootStavanger);
