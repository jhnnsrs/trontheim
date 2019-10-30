import React, {Component} from "react";
import {Button, Card, CardBody, CardImg, CardImgOverlay, CardSubtitle, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class Flows extends Component {

    render() {
        const {flows, locker} = this.props;
        if (flows && locker) {
            return (
                <React.Fragment>
                {flows.map(flow =>
                        <Card className="mt-2" key={flow.data.id}>
                            <CardBody>
                                <CardTitle>{flow.data.id}</CardTitle>
                                <ButtonToNavigate size="sm" outline  to={"/lockerflow/"+flow.data.id+ "/locker/" + locker.id}>
                                    {flow.data.name}
                                </ButtonToNavigate>
                            </CardBody>

                        </Card>)}
                </React.Fragment>
            );
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: LockerStavanger) => ({
    flows: stavanger.lockerflows.selectors.getList,
    locker: stavanger.locker.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: LockerStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Flows);
