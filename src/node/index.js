import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Col, Container, Row} from "reactstrap";
import {nodeStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import NodeDetailCard from "./smartcomponents/NodeDetailCard";


export class Locker extends Component {

    render() {
        return (
            <Container id="locker">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <NodeDetailCard/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(nodeStavanger)(orchestraterEpic)(Locker)("node",rootStavanger);
