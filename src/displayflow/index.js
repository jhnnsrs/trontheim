import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Container, Row} from "reactstrap";
import {displayFlowStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import DisplayComponent from "./smartcomponents/DisplayComponent";
import {MainContainer, Sidebar} from "../common/components/HomeRow";
import Show from "../common/flow/Show";
import Registry from "../common/flow/Registry";
import FlowComponent from "../common/flow/FlowComponent";
import LayoutsCard from "../common/flow/LayoutsCard";

export class Bergen extends Component {

    render() {
        console.log("Rerender Major Template")
        return (
            <Container id="display">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Sidebar>
                                <FlowComponent/>
                                <DisplayComponent/>
                                <LayoutsCard/>
                                <Show/>
                            </Sidebar>
                            <MainContainer>
                                <Registry/>
                            </MainContainer>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(displayFlowStavanger)(orchestraterEpic)(Bergen)("displayflow",rootStavanger);
