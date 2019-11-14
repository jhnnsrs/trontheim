import React, {Component} from "react";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {RoiIteratorStavanger} from "./index";
import * as _ from "lodash";

class RepresentationList extends Component {

    render() {
        const {bioimages} = this.props;
        if (bioimages.data[0]) {
            return (
                <React.Fragment>
                    {bioimages.data.map((bioimage, index) =>
                        <Card className="mt-2" key={_.uniqueId()}>
                            <CardBody>
                                <CardTitle>{bioimage.data.name}</CardTitle>
                                <CardSubtitle>Bioimage {bioimage.data.id}</CardSubtitle>
                                <ButtonGroup>
                                    <Button className="mt-2" outline
                                            onClick={() => this.props.selectItem(bioimage)}>Select</Button>
                                    <Button className="mt-2" outline
                                            onClick={() => this.props.deleteItem(bioimage)}>Delete</Button>
                                </ButtonGroup>
                            </CardBody>

                        </Card>)}
                </React.Fragment>
            );
        } else {
            return (<Card className="mt-2" key={_.uniqueId()}>
                <CardBody>
                    <CardTitle>No Bioimages Sent yet</CardTitle>
                    <CardSubtitle>Module has not yet sent any Bioimage</CardSubtitle>
                </CardBody>

            </Card>)

        }
    }
}

const mapStavangerToProps = (stavanger: RoiIteratorStavanger) => ({
    bioimages: stavanger.sentBioimages.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: RoiIteratorStavanger) =>  ({
    selectItem: (item) => stavanger.sentBioimages.model.selectItem.request(item),
    deleteItem: (item) => stavanger.sentBioimages.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(RepresentationList);
