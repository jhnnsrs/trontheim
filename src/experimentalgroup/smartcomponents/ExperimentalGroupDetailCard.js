import React, {Component} from "react";
import type {ExperimentalGroupStavanger} from "../stavanger";
import {Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class ExperimentalGroupDetailCard extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
    }


    toggle() {
        console.log(this.props.modalOpen)
        this.props.setModal(!this.props.modalOpen)
    }

    render() {
        const {experimentalGroup} = this.props;
        if (experimentalGroup.data) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%" src={"/images/immunohisto.png"}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{experimentalGroup.data.name}</CardTitle>
                        <CardText>
                            <small>{experimentalGroup.data.description}</small>
                        </CardText>
                        <CardText>
                        </CardText>
                    </CardImgOverlay>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: ExperimentalGroupStavanger) => ({
    experimentalGroup: stavanger.experimentalGroup.selectors.getModel,
    modalOpen: stavanger.page.selectors.getProp(item => item.modalOpen)
});

const mapStavangerToDispatch  = (stavanger: ExperimentalGroupStavanger) =>  ({

    setModal: (open) => stavanger.page.model.setProp.request({key: "modalOpen", value: open})

});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ExperimentalGroupDetailCard);
