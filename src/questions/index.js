import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Col, Container, Row} from "reactstrap";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import UserDetailCard from "./smartcomponents/UserDetailCard";
import {questionsStavanger} from "./stavanger";
import QuestionList from "./smartcomponents/QuestionList";
import QuickLinksCard from "./smartcomponents/QuickLinksCard";


export class Lockers extends Component {

    render() {
        return (
            <Container id="lockers">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <UserDetailCard/>
                                <QuickLinksCard/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <QuestionList/>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(questionsStavanger)(orchestraterEpic)(Lockers)("questions",rootStavanger);
