import React, {Component} from "react";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {RoiSelectorStavanger} from "./index";
import * as _ from "lodash";

class SelectionList extends Component {

    render() {
        const {list} = this.props;
        if (list.data[0]) {
            return (
                <React.Fragment>
                    {list.data.map((item, index) =>
                        <Card className="mt-2" key={_.uniqueId()}>
                            <CardBody>
                                <CardTitle>{item.data.name}</CardTitle>
                                <CardSubtitle>Roi {item.data.id}</CardSubtitle>
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
