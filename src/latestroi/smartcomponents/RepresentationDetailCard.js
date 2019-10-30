import React, {Component} from "react";
import type {LatestRoiStavanger} from "../stavanger";
import {Button, Card, CardBody, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import Octicon, {Plus} from "@githubprimer/octicons-react";

class RepresentationDetailCard extends Component {

    render() {
        const {representation} = this.props;
        if (representation.data) {
            return (
                <Card className="mt-2">
                        <CardTitle>{representation.data.name}</CardTitle>
                        <CardText>
                            <small>{representation.data.description}</small>
                        </CardText>
                        <CardBody>
                            <Button size="sm" outline color="light" onClick={this.toggle}><Octicon icon={Plus}
                                                                                                   ariaLabel="Add new item"/> Add
                                Sample</Button>
                        </CardBody>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: LatestRoiStavanger) => ({
    representation: stavanger.selectedRepresentation.selectors.getModel,
    displays: stavanger.displays.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: LatestRoiStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(RepresentationDetailCard);
