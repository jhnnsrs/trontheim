import React, {Component} from "react";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {ExperimentSelector} from "./index";
import * as _ from "lodash";

class TransformationList extends Component {

    render() {
        const {list} = this.props;
        if (list.data[0]) {
            return (
                <React.Fragment>
                    {list.data.map((item, index) =>
                        <Card className="mt-2" key={_.uniqueId()}>
                            <CardBody>
                                <CardTitle>{item.data.name}</CardTitle>
                                <CardSubtitle>Transformation {item.data.id}</CardSubtitle>
                                <ButtonGroup>
                                    <Button className="mt-2" outline
                                            onClick={() => this.props.selectItem(item)}>Select</Button>
                                    <Button className="mt-2" outline
                                            onClick={() => this.props.deleteItem(item)}>Delete</Button>
                                </ButtonGroup>
                            </CardBody>

                        </Card>)}
                </React.Fragment>
            );
        } else {
            return (<Card className="mt-2" key={_.uniqueId()}>
                <CardBody>
                    <CardTitle>No Exhibits  Found</CardTitle>
                    <CardSubtitle>Module has not yet received a User</CardSubtitle>
                </CardBody>

            </Card>)

        }
    }
}

const mapStavangerToProps = (stavanger: ExperimentSelector) => ({
    list: stavanger.transformations.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: ExperimentSelector) =>  ({
    selectItem: (item) => stavanger.transformations.model.selectItem.request(item),
    deleteItem: (item) => stavanger.transformations.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(TransformationList);
