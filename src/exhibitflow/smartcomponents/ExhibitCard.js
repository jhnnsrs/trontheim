import React, {Component} from "react";
import type {DisplayFlowStavanger} from "../stavanger";
import {Card, CardBody, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class ExhibitCard extends Component {

    render() {
        const {exhibit} = this.props;
        if (exhibit) {
            return (
                <Card className="mt-2">
                    <CardBody>
                        <CardTitle>{exhibit.name}</CardTitle>
                        <CardText>
                            <small>Representation {exhibit.representation} in Sample {exhibit.sample}</small>
                        </CardText>
                    </CardBody>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: DisplayFlowStavanger) => ({
    exhibit: stavanger.exhibit.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: DisplayFlowStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ExhibitCard);
