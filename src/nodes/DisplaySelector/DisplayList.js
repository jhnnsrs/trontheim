import React, {Component} from "react";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {DisplaySelectorStavanger} from "./index";
import * as _ from "lodash";

class DisplayList extends Component {

    render() {
        const {displays} = this.props;
        if (displays.data[0]) {
            return (
                <React.Fragment>
                    {displays.data.map((representation, index) =>
                        <Card className="mt-2" key={_.uniqueId()}>
                            <CardBody>
                                <CardTitle>{representation.data.name}</CardTitle>
                                <CardSubtitle>Roi {representation.data.id}</CardSubtitle>
                                <ButtonGroup>
                                    <Button className="mt-2" outline
                                            onClick={() => this.props.selectItem(representation)}>Select</Button>
                                    <Button className="mt-2" outline
                                            onClick={() => this.props.deleteItem(representation)}>Delete</Button>
                                </ButtonGroup>
                            </CardBody>

                        </Card>)}
                </React.Fragment>
            );
        } else {
            return (<Card className="mt-2" key={_.uniqueId()}>
                <CardBody>
                    <CardTitle>No Sample</CardTitle>
                    <CardSubtitle>Module has not yet received a Sample</CardSubtitle>
                </CardBody>

            </Card>)

        }
    }
}

const mapStavangerToProps = (stavanger: DisplaySelectorStavanger) => ({
    displays: stavanger.displays.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: DisplaySelectorStavanger) =>  ({
    selectItem: (item) => stavanger.displays.model.selectItem.request(item),
    deleteItem: (item) => stavanger.displays.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(DisplayList);
