import React, {Component} from "react";
import type {RoiStavanger} from "../stavanger";
import {Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class RoiDetailCard extends Component {

    render() {
        const {roi} = this.props;
        if (roi) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%" src={"../images/immunohisto.png"}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{roi.id}</CardTitle>
                        <CardText>
                            <small>{roi.description}</small>
                        </CardText>
                        <CardText>
                        </CardText>
                    </CardImgOverlay>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: RoiStavanger) => ({
    roi: stavanger.roi.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: RoiStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(RoiDetailCard);
