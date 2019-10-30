import React, {Component} from "react";
import type {AnswerStavanger, SampleStavanger} from "../stavanger";
import {Button, Card, CardBody, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import Octicon, {Plus} from "@githubprimer/octicons-react";

class AnswerDetailCard extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
    }


    toggle() {
        console.log(this.props.modalOpen)
        this.props.setModal(!this.props.modalOpen)
    }

    render() {
        const {item} = this.props;
        if (item) {
            return (
                <Card className="mt-2">
                        <CardBody>
                            <CardTitle>{item.name}</CardTitle>
                            <CardText>
                                <small>Key: {item.key}</small>
                            </CardText>
                        </CardBody>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: AnswerStavanger) => ({
    item: stavanger.answer.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: AnswerStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(AnswerDetailCard);
