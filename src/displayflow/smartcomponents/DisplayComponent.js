import React, {Component} from "react";
import type {DisplayFlowStavanger} from "../stavanger";
import {Button, Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class DisplayComponent extends Component {

    render() {
        const {display} = this.props;
        if (display) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%"  src={display.image}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{display.name}</CardTitle>
                        <CardText>
                            <small>Representation {display.representation} in Sample {display.sample}</small>
                        </CardText>
                    </CardImgOverlay>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: DisplayFlowStavanger) => ({
    display: stavanger.display.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: DisplayFlowStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(DisplayComponent);
