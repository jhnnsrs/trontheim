import React, {Component} from "react";
import type {BioSeriesStavanger} from "../stavanger";
import {Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class BioSeriesDetailCard extends Component {

    render() {
        const {bioseries} = this.props;
        if (bioseries.data) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%" src={"../images/samples.jpeg"}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{bioseries.data.name}</CardTitle>
                        <CardText>
                            <small>{bioseries.data.description}</small>
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

const mapStavangerToProps = (stavanger: BioSeriesStavanger) => ({
    bioseries: stavanger.bioseries.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: BioSeriesStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(BioSeriesDetailCard);
