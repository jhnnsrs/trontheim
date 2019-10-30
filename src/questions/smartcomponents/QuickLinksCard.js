import React, {Component} from "react";
import {Button, Card, CardBody, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {Link} from "react-router-dom";
import {connectInstrument} from "../../alta/react";
import type {HomeStavanger} from "../stavanger";
import {userSelector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";
import OsloLink from "../../generics/OsloLink";

class QuickLinksCard extends Component {


    render() {
        return (
            <Card inverse className="mt-2 bg-dark">
                <CardBody>
                    <CardTitle>Questions</CardTitle>
                    <CardText>
                        <small>For information on how to use questions refer to the manual</small>
                    </CardText>
                    {}
                    <CardText>
                        <OsloLink  base="true" size="sm" outline="true" color="light" to={"/graphql"}>Open Question Playground</OsloLink>
                    </CardText>
                </CardBody>
            </Card>
            )
    }
}

const mapStavangerToProps = (stavanger: HomeStavanger) => ({

});

const mapStavangerToDispatch  = (stavanger: HomeStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(QuickLinksCard);
