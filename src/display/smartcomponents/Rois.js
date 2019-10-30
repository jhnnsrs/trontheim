import React, {Component} from "react";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardText, CardTitle, Col, Container, Row} from "reactstrap";
import Octicon, {LightBulb, Plus, Squirrel} from "@githubprimer/octicons-react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";
import {ScrollabeHorizontalListCreator} from "../../generics/creators/ScrollableHorizontalList";

const RoisScrollableList = ScrollabeHorizontalListCreator(stavanger => stavanger.rois)


class Rois extends Component {

    render() {
        return (
            <Card className="mt-2">
                <CardBody>
                    <CardTitle>
                        <Row>
                            <Col className="col-auto mr-auto">Rois</Col>
                            <Col className="col-auto">
                            </Col>
                        </Row>
                    </CardTitle>
                    <RoisScrollableList maxItems={5} minItems={5}>
                        {(roi, key, selectItem, deleteItem) =>
                            <div key={key}>
                                <Card className="mr-2 overflow-hidden" onClick={() => selectItem(roi)}>
                                    <CardBody>
                                        <CardTitle>{roi.data.id}</CardTitle>
                                        <CardText>
                                            Type: {roi.data.type}
                                        </CardText>
                                        <ButtonGroup>
                                            <ButtonToNavigate outline size="sm" color={"primary"}
                                                              to={"/roi/" + roi.data.id}>Open</ButtonToNavigate>
                                            <Button outline size="sm" color={"danger"}
                                                    onClick={() => deleteItem(roi)}> Delete </Button>
                                        </ButtonGroup>
                                    </CardBody>

                                </Card>
                            </div>}
                    </RoisScrollableList>
                </CardBody>
            </Card>
        );
    }
}


export default Rois
