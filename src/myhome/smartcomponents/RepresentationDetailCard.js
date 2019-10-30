import React, {Component} from "react";
import type {HomeStavanger} from "../stavanger";
import {Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class RepresentationDetailCard extends Component {

    render() {
        const {representation} = this.props;
        if (representation.data) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%" src={"../images/samples.jpeg"}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{representation.data.name}</CardTitle>
                        <CardText>
                            <small>{representation.data.description}</small>
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

const mapStavangerToProps = (stavanger: HomeStavanger) => ({
    representation: stavanger.representation.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: HomeStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(RepresentationDetailCard);
