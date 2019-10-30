import React, {Component} from "react";
import type {BioImageStavanger} from "../stavanger";
import {Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class BioImageDetailCard extends Component {

    render() {
        const {bioimage} = this.props;
        if (bioimage.data) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%" src={"../images/samples.jpeg"}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{bioimage.data.name}</CardTitle>
                        <CardText>
                            <small>{bioimage.data.description}</small>
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

const mapStavangerToProps = (stavanger: BioImageStavanger) => ({
    bioimage: stavanger.bioimage.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: BioImageStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(BioImageDetailCard);
