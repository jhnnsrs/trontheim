import React, {Component} from "react";
import type {NodeItemsStavanger} from "../stavanger";
import {Button, Card, CardBody, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import Octicon, {Plus} from "@githubprimer/octicons-react";
import NodeFormModal from "./NodeFormModal";
import {userPortal} from "../../portals";

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
        if (creator) {
            return (
                <Card className="mt-2">
                        <CardBody>
                            <CardTitle>User {creator.username}</CardTitle>
                            <CardText>
                                <small>{creator.email}</small>
                            </CardText>

                                <Button size="sm" outline onClick={this.toggle}><Octicon icon={Plus}
                                                                                                       ariaLabel="Add new item"/> Add
                                    Node</Button>
                        </CardBody>
                        <NodeFormModal fade={false}/>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: NodeItemsStavanger) => ({
    creator: userPortal,
    modalOpen: stavanger.page.selectors.getProp(item => item.modalOpen)
});

const mapStavangerToDispatch  = (stavanger: NodeItemsStavanger) =>  ({
    setModal: (open) => stavanger.page.model.setProp.request({key: "modalOpen", value: open})
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(UserDetailCard);
