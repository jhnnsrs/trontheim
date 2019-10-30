import React, {Component} from "react";
import type {DisplayStavanger} from "../stavanger";
import {Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class DisplayDetailCard extends Component {

    render() {
        const {display} = this.props;
        if (display.data) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%" src={display.data.image}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{display.data.id}</CardTitle>
                        <CardText>
                            <small>{display.data.description}</small>
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

const mapStavangerToProps = (stavanger: DisplayStavanger) => ({
    display: stavanger.display.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: DisplayStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(DisplayDetailCard);
