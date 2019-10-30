import React, {Component} from "react";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardImg,
    CardImgOverlay,
    CardSubtitle,
    CardText,
    CardTitle
} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import Octicon, {Plus} from "@githubprimer/octicons-react";
import type {ExhibitSelectorStavanger} from "./index";
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
                    <CardTitle>No Bioimages</CardTitle>
                    <CardSubtitle>Module has not yet received a Locker</CardSubtitle>
                </CardBody>

            </Card>)

        }
    }
}

const mapStavangerToProps = (stavanger: ExhibitSelectorStavanger) => ({
    bioimages: stavanger.bioimages.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: ExhibitSelectorStavanger) =>  ({
    selectItem: (item) => stavanger.bioimages.model.selectItem.request(item),
    deleteItem: (item) => stavanger.bioimages.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(RepresentationList);
