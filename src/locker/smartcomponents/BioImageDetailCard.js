import React, {Component} from "react";
import type {LockerStavanger} from "../stavanger";
import {Button, Card, CardBody, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import Octicon, {Plus} from "@githubprimer/octicons-react";

class BioImageDetailCard extends Component {

    render() {
        const {representation} = this.props;
        if (representation.data) {
            return (
                <Card className="mt-2">
                        <CardTitle>{representation.data.name}</CardTitle>
                        <CardText>
                            <small>{representation.data.description}</small>
                        </CardText>
                        <CardBody>
                            <Button size="sm" outline color="light" onClick={this.toggle}><Octicon icon={Plus}
                                                                                                   ariaLabel="Add new item"/> Add
                                Sample</Button>
                        </CardBody>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: LockerStavanger) => ({
    representation: stavanger.selectedBioimage.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: LockerStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(BioImageDetailCard);
