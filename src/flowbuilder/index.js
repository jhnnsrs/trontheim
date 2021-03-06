import React, {Component} from 'react';
import {Container, Row} from 'reactstrap';
import './style.scss';
import {connectOpera} from "../alta/react";
import {orchestraterEpic} from "./orchestrator";
import {rootStavanger} from "../rootStavanger";
import {flowBuilderStavanger} from "./stavanger";
import FlowsList from "./smartcomponents/FlowsList";
import NodesList from "./smartcomponents/NodesList";
import GraphBuilder from "./smartcomponents/FlowBuilder";
import {MainContainer, Sidebar} from "../common/components/HomeRow";
import NodeSlick from "./smartcomponents/NodeSlick";


class FlowBuilder extends Component {

    render() {
        return (
            <Container>
                    <Container>
                        <Row>
                            <Sidebar>
                                <FlowsList/>
                            </Sidebar>
                            <MainContainer xs={12}  md={7} lg={9} xl={10}>
                                <GraphBuilder/>
                                <NodeSlick/>
                            </MainContainer>
                        </Row>
                    </Container>
            </Container>
        );
    }
}


// dynamic:
export default connectOpera(flowBuilderStavanger)(orchestraterEpic)(FlowBuilder)("flowbuilder",rootStavanger);



