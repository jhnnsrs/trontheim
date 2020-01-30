import React, {Component} from "react";
import type {SampleStavanger} from "../stavanger";
import {Button, Card, CardBody, CardSubtitle, CardTitle, Col, Container, Row} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import DisplaysForRepresentation from "./DisplaysForRepresentation";
import ExhibitsForRepresentation from "./ExhibitsForRepresentation";
import {Link} from "react-router-dom";
import ButtonToNavigate from "../../generics/ButtonToNavigate";
import * as _ from "lodash";

class Representations extends Component {

    render() {
        const {representations, flows} = this.props;
        if (representations.data) {
            return (
                <React.Fragment>
                {representations.data.map((representation, index) =>
                        <Card className="mt-2 overflow-auto" key={representation.data.id} onClick={() => this.props.selectRepresentation(representation)}>
                            <CardBody>
                                <CardTitle>
                                    <Row>
                                        <Col className="col-auto mr-auto"><Link className="align-self-center" to={"/representation/"+representation.data.id}>{representation.data.name}</Link></Col>
                                        <Col className="col-auto"><Button outline size={"sm"} onClick={() => this.props.deleteItem(representation)}> Del </Button> </Col>
                                    </Row>
                                </CardTitle>
                                <CardSubtitle>Representation {representation.data.id}</CardSubtitle>
                                { flows.map( (flow,key) =>
                                    <ButtonToNavigate key={_.uniqueId()} size="sm" outline  to={"/representationflow/"+flow.data.id+ "/representation/" + representation.data.id}>
                                        {flow.data.name}
                                    </ButtonToNavigate>
                                )}
                                <Container>
                                    <DisplaysForRepresentation representation={representation}/>
                                    <ExhibitsForRepresentation representation={representation}/>
                                </Container>
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

const mapStavangerToProps = (stavanger: SampleStavanger) => ({
    representations: stavanger.representations.selectors.getModel,
    displays: stavanger.displays.selectors.getModel,
    flows: stavanger.repflows.selectors.getData
});

const mapStavangerToDispatch  = (stavanger: SampleStavanger) =>  ({
    selectRepresentation: (sample) => stavanger.representations.model.selectItem.request(sample),
    deleteItem: (item) => stavanger.representations.model.deleteItem.request(item),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Representations);
