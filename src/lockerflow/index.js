import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Container, Row} from "reactstrap";
import {lockerFlowStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import FlowComponent from "./smartcomponents/FlowComponent";
import LockerComponent from "./smartcomponents/LockerComponent";
import {MainContainer, Sidebar} from "../common/components/HomeRow";
import NodeGridContainer from "../flow/smartcomponents/NodeGridContainer";
import LayoutsCard from "./smartcomponents/LayoutsCard";
import Registry from "./smartcomponents/Registry";

export class Bergen extends Component {


    render() {
        console.log("Rerender Major Template")
        return (
            <Container id="test">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Sidebar>
                                <FlowComponent/>
                                <LockerComponent/>
                                <LayoutsCard/>
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
export  default connectOpera(lockerFlowStavanger)(orchestraterEpic)(Bergen)("!aa",rootStavanger);
