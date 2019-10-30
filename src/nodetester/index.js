import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Card, Col, Container, Row} from "reactstrap";
import {nodetestStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import NodeDetailCard from "./smartcomponents/NodeDetailCard";
import Inputs from "./smartcomponents/Inputs";
import NodeDisplay from "./smartcomponents/NodeDisplay";

export class Experiment extends Component {

    render() {
        console.log("Rerender Major Template")
        return (
            <Container id="test">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <NodeDetailCard/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <Inputs/>
                                <NodeDisplay/>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(nodetestStavanger)(orchestraterEpic)(Experiment)("nodetester",rootStavanger);
