import React, {Component} from "react";
import type {RoiForSampleStavanger} from "../stavanger";
import {Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class SampleDetailCard extends Component {

    render() {
        const {sample} = this.props;
        if (sample.data) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%" src={"../images/samples.jpeg"}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{sample.data.name}</CardTitle>
                        <CardText>
                            <small>{sample.data.description}</small>
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

const mapStavangerToProps = (stavanger: RoiForSampleStavanger) => ({
    sample: stavanger.sample.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: RoiForSampleStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SampleDetailCard);
