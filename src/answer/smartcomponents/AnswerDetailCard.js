import React, {Component} from "react";
import type {AnswerStavanger} from "../stavanger";
import {Card, CardBody, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

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
