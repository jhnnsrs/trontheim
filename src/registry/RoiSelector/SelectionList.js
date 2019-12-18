import React, {Component} from "react";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardSubtitle,
    CardTitle,
    Col, Container,
    ListGroup,
    ListGroupItem,
    Row
} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {RoiSelectorStavanger} from "./index";
import * as _ from "lodash";

class SelectionList extends Component {

    render() {
        const {list} = this.props;
        if (list.data[0]) {
            return (
                <ListGroup>
                    {list.data.map((item, index) =>
                        <ListGroupItem style={{backgroundColor: item.data.color, color: "#FFFFFF"}} key={_.uniqueId()}>
                            <Container fluid={true}>
                                <Row>
                            <Col className="col-auto mr-auto">Roi {item.data.id}</Col>
                            <Col className="col-auto"><ButtonGroup>
                                <Button size="sm"  outline  style={{borderColor: "#FFFFFF", color: "#FFFFFF"}}
                                        onClick={() => this.props.selectItem(item)}>Select</Button>
                                <Button size="sm" outline color="danger"
                                        onClick={() => this.props.deleteItem(item)}>Delete</Button>
                            </ButtonGroup>
                            </Col>
                                </Row>
                            </Container>
                        </ListGroupItem>)}
                </ListGroup>
            );
        } else {
            return (<Card className="mt-2" key={_.uniqueId()}>
                <CardBody>
                    <CardTitle>No Roi</CardTitle>
                    <CardSubtitle>Module has not yet received a Sample</CardSubtitle>
                </CardBody>

            </Card>)

        }
    }
}

const mapStavangerToProps = (stavanger: RoiSelectorStavanger) => ({
    list: stavanger.rois.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: RoiSelectorStavanger) =>  ({
    selectItem: (item) => stavanger.rois.model.selectItem.request(item),
    deleteItem: (item) => stavanger.rois.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SelectionList);
