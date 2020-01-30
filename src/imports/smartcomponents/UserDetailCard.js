import React, {Component} from "react";
import type {ImportsStavanger} from "../stavanger";
import {Button, Card, CardBody, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import Octicon, {Plus} from "@githubprimer/octicons-react";
import LockerFormModal from "./LockerFormModal";

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

                                <Button size="sm" outline onClick={this.toggle}><Octicon icon={Plus}
                                                                                                       ariaLabel="Add new item"/> Add
                                    Locker</Button>
                        </CardBody>
                        <LockerFormModal fade={false}/>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: ImportsStavanger) => ({
    creator: stavanger.creator.selectors.getModel,
    modalOpen: stavanger.page.selectors.getProp(item => item.modalOpen)
});

const mapStavangerToDispatch  = (stavanger: ImportsStavanger) =>  ({
    setModal: (open) => stavanger.page.model.setProp.request({key: "modalOpen", value: open})
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(UserDetailCard);
