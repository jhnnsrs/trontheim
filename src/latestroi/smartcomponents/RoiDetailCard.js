import React, {Component} from "react";
import type {LatestRoiStavanger} from "../stavanger";
import {Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class RoiDetailCard extends Component {

    render() {
        const {roi} = this.props;
        if (roi.data) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%" src={"/images/immunohisto.png"}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{roi.data.id}</CardTitle>
                        <CardText>
                            <small>{roi.data.description}</small>
                        </CardText>
                        <CardText>
                        </CardText>
                    </CardImgOverlay>
                </Card>);
        }
        else {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%" src={"/images/immunohisto.png"}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>Waiting for Initial Roi</CardTitle>
                        <CardText>
                            <small>Well I am still waiting for you silly boy </small>
                        </CardText>
                        <CardText>
                        </CardText>
                    </CardImgOverlay>
                </Card>);
        }
    }
}

const mapStavangerToProps = (stavanger: LatestRoiStavanger) => ({
    roi: stavanger.roi.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: LatestRoiStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(RoiDetailCard);
