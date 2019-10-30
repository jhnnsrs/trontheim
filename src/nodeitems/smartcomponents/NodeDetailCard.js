import React, {Component} from "react";
import type {NodeItemsStavanger, SampleStavanger} from "../stavanger";
import {Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class NodeDetailCard extends Component {

    render() {
        const {node} = this.props;
        if (node.data) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%" src={"/images/samples.jpeg"}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{node.data.name}</CardTitle>
                        <CardText>
                            <small>{node.data.description}</small>
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

const mapStavangerToProps = (stavanger: NodeItemsStavanger) => ({
    node: stavanger.newNode.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: SampleStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NodeDetailCard);
