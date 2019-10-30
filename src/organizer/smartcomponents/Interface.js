import React, {Component} from "react";
import {Button, Card, CardBody, CardTitle, Col, Container, Row} from "reactstrap";
import Octicon, {Plus} from "@githubprimer/octicons-react";
import DragAndDropArea from "./DragAndDropArea";
import {ColumnBuilder} from "./Columns";

const AllSamplesColumn = ColumnBuilder(stavanger => stavanger.samples)
const SampleGroupOneColumn = ColumnBuilder(stavanger => stavanger.sampleGroup1)

class Interface extends Component {

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
                    <DragAndDropArea>
                        <Container>
                            <Row>
                            <Col>
                            <AllSamplesColumn>
                                { ({data})  =>
                                    <Card>
                                        {data.name}
                                    </Card>
                                }
                            </AllSamplesColumn>
                            </Col>
                            <Col>
                            <SampleGroupOneColumn>
                                { ({data})  =>
                                    <Card>
                                        {data.name}
                                    </Card>
                                }
                            </SampleGroupOneColumn>
                            </Col>
                            </Row>
                        </Container>
                    </DragAndDropArea>
                </CardBody>
            </Card>
        );
    }
}


export default Interface
