import React, {Component} from "react";
import type {RepresentationFlowStavanger} from "../stavanger";
import {Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class RepresentationComponent extends Component {

    render() {
        const {representation} = this.props;
        if (representation.data) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%"  src={"/images/samples.jpeg"}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{representation.data.name}</CardTitle>
                        <CardText>
                            <small>{representation.data.type}  on Sample {representation.data.sample}</small>
                        </CardText>
                    </CardImgOverlay>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: RepresentationFlowStavanger) => ({
    representation: stavanger.representation.selectors.getModel,
    ownProps: stavanger.flow.selectors.getProps
});

const mapStavangerToDispatch  = (stavanger: RepresentationFlowStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(RepresentationComponent);
