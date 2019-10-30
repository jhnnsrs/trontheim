import React, {Component} from "react";
import type {ExhibitStavanger} from "../stavanger";
import {Card, CardBody, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class ExhibitDetailCard extends Component {

    render() {
        const {exhibit} = this.props;
        if (exhibit.data) {
            return (
                <Card className="mt-2">
                    <CardBody>
                        <CardTitle>{exhibit.data.id}</CardTitle>
                        <CardText>
                            <small>{exhibit.data.representation}</small>
                        </CardText>
                        <CardText>
                        </CardText>
                    </CardBody>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: ExhibitStavanger) => ({
    exhibit: stavanger.exhibit.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: ExhibitStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ExhibitDetailCard);
