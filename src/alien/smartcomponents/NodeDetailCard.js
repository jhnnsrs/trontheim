import React, {Component} from "react";
import type {AlienStavanger} from "../stavanger";
import {Button, Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class NodeDetailCard extends Component {

    render() {
        const {item} = this.props;
        if (item.data) {
            return (
                <Card className="mt-2">
                        <CardTitle>{item.data.name}</CardTitle>
                        <CardText>
                        </CardText>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: AlienStavanger) => ({
    item: stavanger.node.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: AlienStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NodeDetailCard);
