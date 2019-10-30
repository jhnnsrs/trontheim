import React, {Component} from "react";
import type {OrganizerStavanger} from "../stavanger";
import {Button, Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import Octicon, {Plus} from "@githubprimer/octicons-react";

class ExperimentDetailCard extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
    }


    toggle() {
        console.log(this.props.modalOpen)
        this.props.setModal(!this.props.modalOpen)
    }

    render() {
        const {experiment} = this.props;
        if (experiment.data) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%" src={experiment.data.image}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{experiment.data.name}</CardTitle>
                        <CardText>
                            <small>{experiment.data.description}</small>
                        </CardText>
                        <CardText>
                            <Button size="sm" outline color={"light"} onClick={this.toggle}><Octicon icon={Plus}
                                                                                     ariaLabel="Add new item"/> Add
                                Group</Button>
                        </CardText>
                    </CardImgOverlay>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: OrganizerStavanger) => ({
    experiment: stavanger.experiment.selectors.getModel,
    modalOpen: stavanger.page.selectors.getProp(item => item.modalOpen)
});

const mapStavangerToDispatch  = (stavanger: OrganizerStavanger) =>  ({

    setModal: (open) => stavanger.page.model.setProp.request({key: "modalOpen", value: open})

});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ExperimentDetailCard);
