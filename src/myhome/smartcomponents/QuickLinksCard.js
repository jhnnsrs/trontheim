import React, {Component} from "react";
import {Button, Card, CardBody, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {Link} from "react-router-dom";
import {connectInstrument} from "../../alta/react";
import type {HomeStavanger} from "../stavanger";
import {userSelector} from "../../rootMaestros";
import {userIDPortal} from "../../portals";

class QuickLinksCard extends Component {


    render() {
        let { userid} = this.props
        return (
            <Card inverse className="mt-2 bg-dark">
                <CardBody>
                    <CardTitle>Quick Links</CardTitle>
                    <CardText>
                        <small>Try opening your Locker</small>
                    </CardText>
                    {}
                    <CardText>
                        <Link size="sm" outline="true" color="light" to={"/lockers/" + userid}>Open my Lockers</Link><br/>
                        <Link size="sm" outline="true" color="light" to={"/imports/" + userid}>Imports</Link><br/>
                        <Link size="sm" outline="true" color="light" to={"/latestroi/" + this.props.id}>LatestRois</Link><br/>
                        <Link size="sm" outline="true" color="light" to={"/flows/" + this.props.id}>Flows</Link><br/>
                        <Link size="sm" outline="true" color="light" to={"/questions"}>Questions</Link><br/>
                        <Link size="sm" outline="true" color="light" to={"/answers/"}>Answers</Link><br/>
                        <Link size="sm" outline="true" color="light" to={"/flowbuilder"}>FlowBuilder</Link><br/>
                        <Link size="sm" outline="true" color="light" to={"/nodebuilder"}>NodeBuilder</Link><br/>
                        <Link size="sm" outline="true" color="light" to={"/aliens"}>Available Aliens</Link><br/>
                    </CardText>
                </CardBody>
            </Card>
            )
    }
}

const mapStavangerToProps = (stavanger: HomeStavanger) => ({
    userid: userIDPortal
});

const mapStavangerToDispatch  = (stavanger: HomeStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(QuickLinksCard);
