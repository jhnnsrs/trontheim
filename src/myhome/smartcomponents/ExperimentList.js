import React, {Component} from "react";
import type {HomeStavanger} from "../stavanger";
import {Button, Card, CardBody, CardSubtitle, CardText, CardTitle, Col, Row} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import SamplesForExperiments from "./SamplesForExperiments";
import List from "../../generics/List";
import {Link} from "react-router-dom";

class ExperimentList extends Component {

    render() {
        return(
            <List list={this.props.list}>
            { (experiment) =>
                        <Card className="mt-2 d-block" key={experiment.data.id} onClick={() => this.props.selectItem(experiment)}>
                            <CardBody>
                                <CardTitle>
                                    <Row>
                                        <Col className="col-auto mr-auto"><Link className="align-self-center" to={"/experiment/"+experiment.data.id}>{experiment.data.name}</Link></Col>
                                        <Col className="col-auto"><Button outline size={"sm"} onClick={() => this.props.deleteItem(experiment)}> Del </Button> </Col>
                                    </Row>
                                </CardTitle>
                                <CardSubtitle>Experiment {experiment.data.id}</CardSubtitle>
                                <CardText>{experiment.data.description}

                                </CardText>
                                <SamplesForExperiments experiment={experiment}/>
                            </CardBody>
                        </Card>}
            </List>
            );
    }
}

const mapStavangerToProps = (stavanger: HomeStavanger) => ({
    list: stavanger.experiments.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: HomeStavanger) =>  ({
    selectItem: (item) => stavanger.experiments.model.selectItem.request(item),
    deleteItem: (item) => stavanger.experiments.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ExperimentList);
