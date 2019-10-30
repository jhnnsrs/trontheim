import React, {Component} from "react";
import Octicon, {Plus} from "@githubprimer/octicons-react";
import AddExperimentModal from "./AddExperimentModal";
import {Button, Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import type {HomeStavanger} from "../../stavanger";
import {connectInstrument} from "../../../alta/react";

class AddExperimentCard extends Component {

    render() {
        return (
            <Card inverse className="mt-2">
                <CardImg top width="100%" src={"/images/immunohisto.png"}
                         alt="Card image cap"/>
                <CardImgOverlay className="blur">
                    <CardTitle>My Experiments</CardTitle>
                    <CardText>
                        <small>All the Experiments you have created in recent order</small>
                    </CardText>
                    <CardText>
                        <Button size="sm" outline color="light" onClick={this.props.openModal}><Octicon icon={Plus} ariaLabel="Add new item"/> Add
                            Experiment</Button>
                            <AddExperimentModal/>
                    </CardText>
                </CardImgOverlay>
            </Card>);
    }
}

const mapStavangerToProps = (stavanger: HomeStavanger) => ({
});

const mapStavangerToDispatch  = (stavanger: HomeStavanger) =>  ({
    openModal: (item) => stavanger.page.model.setProp.request({key: "modalOpen", value: true})
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(AddExperimentCard);