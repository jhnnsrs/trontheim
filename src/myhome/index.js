import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Container, Row} from "reactstrap";
import {homeStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import ExperimentList from "./smartcomponents/ExperimentList";
import AddExperimentCard from "./smartcomponents/AddExperiment/AddExperimentCard";
import QuickLinksCard from "./smartcomponents/QuickLinksCard";
import {MainContainer, Sidebar} from "../common/components/HomeRow";


export class Representation extends Component {

    render() {
        return (
            <Container>
                    <Container>
                        <Row>
                            <Sidebar>
                                <AddExperimentCard/>
                                <QuickLinksCard/>
                            </Sidebar>
                            <MainContainer xs={12}  md={7} lg={9} xl={10}>
                                <ExperimentList/>
                            </MainContainer>
                        </Row>
                    </Container>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(homeStavanger)(orchestraterEpic)(Representation)("myhome",rootStavanger);
