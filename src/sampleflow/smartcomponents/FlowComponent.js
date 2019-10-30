import React, {Component} from "react";
import type {SampleFlowStavanger} from "../stavanger";
import {Button, Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import Octicon, {Plus} from "@githubprimer/octicons-react";
import logo from '../..';

class FlowComponent extends Component {

    render() {
        const {flow} = this.props;
        if (flow.data) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%" src={"/images/samples.jpeg"}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{flow.data.name}</CardTitle>
                        <CardText>
                            <small>{flow.data.description}</small>
                        </CardText>
                        <CardText>
                            <Button size="sm" outline color="light" onClick={this.toggle}><Octicon icon={Plus}
                                                                                                   ariaLabel="Add new item"/> Add
                                Flow</Button>
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
    flow: stavanger.flow.selectors.getModel,
    ownProps: stavanger.flow.selectors.getProps
});

const mapStavangerToDispatch  = (stavanger: SampleFlowStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(FlowComponent);
