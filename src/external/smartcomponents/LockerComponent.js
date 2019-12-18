import React, {Component} from "react";
import type {ExternalStavanger} from "../stavanger";
import {Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class LockerComponent extends Component {

    render() {
        const {locker} = this.props;
        if (locker.data) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%"  src={"/images/samples.jpeg"}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{locker.data.name}</CardTitle>
                        <CardText>
                            <small>{locker.data.id} in Locker {locker.data.location}</small>
                            <ButtonToNavigate size="sm" outline  to={"/locker/"+locker.data.id}>
                                Open
                            </ButtonToNavigate>
                        </CardText>
                    </CardImgOverlay>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: ExternalStavanger) => ({
    locker: stavanger.locker.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: ExternalStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LockerComponent);
