import React, {Component} from "react";
import {Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class NodeDetailCard extends Component {

    render() {
        const {node} = this.props;
        if (node) {
            return (
                <Card inverse className="mt-2">
                    <CardImg top width="100%" src={"/images/samples.jpeg"}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{node.name}</CardTitle>
                        <CardText>
                            <small>ID {node.id}</small><br/>
                            <small>EntityID {node.entityid}</small><br/>
                            <small>NodeClass {node.nodeclass}</small><br/>
                            <small>Path {node.path}</small><br/>
                            <small>Creator {node.creator}</small><br/><br/>
                            <small>Inputs</small><br/>
                            {JSON.parse(node.inputmodel).map(model => <small> {model} </small>)}<br/><br/>
                            <small>Outputs</small><br/>
                            {JSON.parse(node.outputmodel).map(model => <small> {model} </small>)}<br/>
                        </CardText>
                    </CardImgOverlay>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: NodeStavanger) => ({
    node: stavanger.node.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: NodeStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NodeDetailCard);
