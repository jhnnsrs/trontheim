import React, {Component} from "react";
import type {AnswersStavanger, SampleStavanger} from "../stavanger";
import {Button, Card, CardBody, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import Octicon, {Plus} from "@githubprimer/octicons-react";
import LockerFormModal from "./QuestionFormModal";

class UserDetailCard extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
    }


    toggle() {
        console.log(this.props.modalOpen)
        this.props.setModal(!this.props.modalOpen)
    }

    render() {
        const {creator} = this.props;
        if (creator.data) {
            return (
                <Card className="mt-2">
                        <CardBody>
                            <CardTitle>User {creator.data.username}</CardTitle>
                            <CardText>
                                <small>{creator.data.email}</small>
                            </CardText>
                        </CardBody>
                        <LockerFormModal fade={false}/>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: AnswersStavanger) => ({
    creator: stavanger.creator.selectors.getModel,
    modalOpen: stavanger.page.selectors.getProp(item => item.modalOpen)
});

const mapStavangerToDispatch  = (stavanger: AnswersStavanger) =>  ({
    setModal: (open) => stavanger.page.model.setProp.request({key: "modalOpen", value: open})
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(UserDetailCard);
