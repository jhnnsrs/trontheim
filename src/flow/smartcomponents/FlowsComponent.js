import React, {Component} from "react";
import type {BioImageFlowStavanger} from "../stavanger";
import {Button, Card, CardImg, CardImgOverlay, CardText, CardTitle, Row, Col, Container} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import Octicon, {Plus} from "@githubprimer/octicons-react";
import logo from '../..';
import List from "../../generics/List";
class FlowsComponent extends Component {

    render() {
        return (
            <Container>
                <Row>
                    <List list={this.props.flows}>
                        {(flow,index) =>
                            <Col key={index}>
                            <Card body className="justify-content-center align-content-center">
                                <Button outline onClick={() => this.props.selectFlow(flow)}>{flow.data.name}</Button>
                            </Card>
                            </Col>
                        }
                    </List>
                </Row>
            </Container>
        )
    }
}

const mapStavangerToProps = (stavanger: BioImageFlowStavanger) => ({
    flows: stavanger.flows.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: BioImageFlowStavanger) =>  ({
    selectFlow: (flow) => stavanger.flows.model.selectItem.request(flow)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(FlowsComponent);
