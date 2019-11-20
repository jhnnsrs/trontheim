import React, {Component} from "react";
import type {ExternalStavanger} from "../stavanger";
import {Button, Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import Octicon, {Plus} from "@githubprimer/octicons-react";

class ExternalComponent extends Component {

    render() {
        const {external} = this.props;
        if (external) {
            return (
                <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%" src={"/images/samples.jpeg"}
                             alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                        <CardTitle>{external.name}</CardTitle>
                        <CardText>
                            <small>{external.defaultsettings}</small>
                        </CardText>
                    </CardImgOverlay>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: ExternalStavanger) => ({
    external: stavanger.external.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: ExternalStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ExternalComponent);
