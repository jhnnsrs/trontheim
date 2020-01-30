import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Col, Container, Row} from "reactstrap";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import UserDetailCard from "./smartcomponents/UserDetailCard";
import {nodeItemsStavanger} from "./stavanger";
import Nodes from "./smartcomponents/Nodes";


export class Lockers extends Component {

    render() {
        return (
            <Container id="nodeitems">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <UserDetailCard/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <Nodes/>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(nodeItemsStavanger)(orchestraterEpic)(Lockers)("nodeitems",rootStavanger);
