import React, {Component} from "react";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardText, CardTitle, Col, Row} from "reactstrap";
import Octicon, {Plus} from "@githubprimer/octicons-react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";
import {ScrollabeHorizontalListCreator} from "../../generics/creators/ScrollableHorizontalList";

const AnimalScrollableList = ScrollabeHorizontalListCreator(stavanger => stavanger.animals)


class Animals extends Component {

    render() {
        return (
            <Card>
                <CardBody>
                    <CardTitle>
                        <Row>
                            <Col className="col-auto mr-auto">Animals</Col>
                            <Col className="col-auto">
                                <Button size={"sm"} outline onClick={() => alert("ADDING ANIMAL NOT IMPLEMENTED")}>
                                    <Octicon icon={Plus} ariaLabel="Add new item"/> Add Animal
                                </Button>
                            </Col>
                        </Row>
                    </CardTitle>
                    <AnimalScrollableList maxItems={5} minItems={5}>
                        {(animal, key, selectItem, deleteItem) =>
                            <div>
                                <Card className="mr-2 overflow-hidden" key={key} onClick={() => selectItem(animal)}>
                                    <CardBody>
                                        <CardTitle>{animal.data.name}</CardTitle>
                                        <CardSubtitle>{animal.data.iscontrol && "As Control"}</CardSubtitle>
                                        <div className="w-75 mx-auto">
                                        <img src={"/images/animals/mouse.svg"} alt={"Mouse Icon"}
                                             className="border-primary"/>
                                        </div>
                                        <CardText>
                                            Type: {animal.data.type}
                                        </CardText>
                                        <ButtonGroup>
                                            <ButtonToNavigate outline size="sm" color={"primary"}
                                                              to={"/animal/" + animal.data.id}>Open</ButtonToNavigate>
                                            <Button outline size="sm" color={"danger"}
                                                    onClick={() => deleteItem(animal)}> Delete </Button>
                                        </ButtonGroup>
                                    </CardBody>

                                </Card>
                            </div>}
                    </AnimalScrollableList>
                </CardBody>
            </Card>
        );
    }
}


export default Animals
