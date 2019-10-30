import React, {Component} from "react";
import type {BioImageFlowStavanger} from "../stavanger";
import {Button, Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class BioImageComponent extends Component {

    render() {
        const {bioimage} = this.props;
        if (bioimage.data) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%"  src={"/images/samples.jpeg"}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{bioimage.data.name}</CardTitle>
                        <CardText>
                            <small>{bioimage.data.file} in Locker {bioimage.data.locker}</small>
                        </CardText>
                    </CardImgOverlay>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: BioImageFlowStavanger) => ({
    bioimage: stavanger.bioimage.selectors.getModel,
    ownProps: stavanger.flow.selectors.getProps
});

const mapStavangerToDispatch  = (stavanger: BioImageFlowStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(BioImageComponent);
