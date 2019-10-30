import React, {Component} from "react";
import type {LockersStavanger, SampleStavanger} from "../stavanger";
import {Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class LockerDetailCard extends Component {

    render() {
        const {locker} = this.props;
        if (locker.data) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%" src={"/images/samples.jpeg"}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{locker.data.name}</CardTitle>
                        <CardText>
                            <small>{locker.data.description}</small>
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

const mapStavangerToProps = (stavanger: LockersStavanger) => ({
    locker: stavanger.selectedLocker.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: SampleStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LockerDetailCard);
