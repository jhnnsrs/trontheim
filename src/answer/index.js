import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Col, Container, Row} from "reactstrap";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import UserDetailCard from "./smartcomponents/AnswerDetailCard";
import {answerStavanger} from "./stavanger";
import ProfilesList from "./smartcomponents/ProfilesList";
import Visualizers from "./smartcomponents/Visualizers";
import ExcelExports from "./smartcomponents/ExcelExports";


export class Lockers extends Component {

    render() {
        return (
            <Container id="lockers">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <UserDetailCard/>
                                <Visualizers/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <ProfilesList/>
                                <ExcelExports/>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(answerStavanger)(orchestraterEpic)(Lockers)("answer",rootStavanger);
