import React, {Component} from "react";
import type {SampleFlowStavanger} from "../stavanger";
import {Button, Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class SampleComponent extends Component {

    render() {
        const {sample} = this.props;
        if (sample.data) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%"  src={"/images/samples.jpeg"}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{sample.data.name}</CardTitle>
                        <CardText>
                            <small>{sample.data.file} in Locker {sample.data.locker}</small>
                            <ButtonToNavigate size="sm" outline  to={"/sample/"+sample.data.id}>
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

const mapStavangerToProps = (stavanger: SampleFlowStavanger) => ({
    sample: stavanger.sample.selectors.getModel,
    ownProps: stavanger.flow.selectors.getProps
});

const mapStavangerToDispatch  = (stavanger: SampleFlowStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SampleComponent);
