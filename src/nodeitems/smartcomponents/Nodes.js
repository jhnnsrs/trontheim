import React, {Component} from "react";
import type {NodeItemsStavanger} from "../stavanger";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle, Col, Row} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";
import {Link} from "react-router-dom";

class Nodes extends Component {

    render() {
        const { nodes} = this.props;
        if (nodes.data) {
            return (
                <React.Fragment>
                {nodes.data.map((node, index) =>
                        <Card className="mt-2 overflow-auto" key={node.data.id} onClick={() => this.props.selectBioimage(node)}>
                            <CardBody>
                                <CardTitle>
                                    <Row>
                                        <Col className="col-auto mr-auto"><Link className="align-self-center" to={"/locker/"+node.data.id}>{node.data.name}</Link></Col>
                                        <Col className="col-auto"><Button outline size={"sm"} onClick={() => this.props.deleteItem(node)}> Del </Button> </Col>
                                    </Row>
                                </CardTitle>
                                <CardSubtitle>Locker in Location '{node.data.location}'</CardSubtitle>
                                <ButtonGroup>
                                    <ButtonToNavigate size="sm" to={"/node/" + node.data.id}>Open</ButtonToNavigate>
                                </ButtonGroup>
                            </CardBody>
                        </Card>)}
                </React.Fragment>
            );
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: NodeItemsStavanger) => ({
    nodes: stavanger.nodes.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: NodeItemsStavanger) =>  ({
    selectBioimage: (locker) => stavanger.nodes.model.selectItem.request(locker),
    deleteItem: (locker) => stavanger.nodes.model.deleteItem.request(locker),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Nodes);
