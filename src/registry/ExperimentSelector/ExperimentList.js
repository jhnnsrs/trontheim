import React, {Component} from "react";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {ExperimentSelector} from "./index";
import * as _ from "lodash";

class ExperimentList extends Component {

    render() {
        const {list} = this.props;
        if (list.data[0]) {
            return (
                <React.Fragment>
                    {list.data.map((experiment, index) =>
                        <Card className="mt-2" key={_.uniqueId()}>
                            <CardBody>
                                <CardTitle>{experiment.data.name}</CardTitle>
                                <CardSubtitle>Experiment {experiment.data.id}</CardSubtitle>
                                <ButtonGroup>
                                    <Button className="mt-2" outline
                                            onClick={() => this.props.selectItem(experiment)}>Select</Button>
                                    <Button className="mt-2" outline
                                            onClick={() => this.props.deleteItem(experiment)}>Delete</Button>
                                </ButtonGroup>
                            </CardBody>

                        </Card>)}
                </React.Fragment>
            );
        } else {
            return (<Card className="mt-2" key={_.uniqueId()}>
                <CardBody>
                    <CardTitle>No Experiments Found</CardTitle>
                    <CardSubtitle>Module has not yet received a User</CardSubtitle>
                </CardBody>

            </Card>)

        }
    }
}

const mapStavangerToProps = (stavanger: ExperimentSelector) => ({
    list: stavanger.experiments.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: ExperimentSelector) =>  ({
    selectItem: (item) => stavanger.experiments.model.selectItem.request(item),
    deleteItem: (item) => stavanger.experiments.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ExperimentList);
