import React, {Component} from "react";
import {Route, Switch} from 'react-router-dom'



// Header Fouter and Route
import PrivateRoute from "../auth/PrivateRoute";
import Footer from "../common/components/Footer";
import Header from "../header";

// Common Stavanger
import Experiment from "../experiment";
import NodeBuilder from "../nodebuilder";
import Sample from "../sample";
import Node from "../node";
import Organizer from "../organizer";
import RoisForSample from "../roisforsample";
import Locker from "../locker";
import BioSeries from "../bioseries";
import FlowBuilder from "../flowbuilder";
import BioImage from "../bioimage";
import NodeTester from "../nodetester";
import Roi from "../roi";
import LatestRoi from "../latestroi";
import Nodes from "../nodeitems";
import Display from "../display";
import BioImageFlow from "../bioimageflow";
import ExhibitFlow from "../exhibitflow";
import LockerFlow from "../lockerflow";
import DisplayFlow from "../displayflow";
import Lockers from "../lockers";
import SampleFlow from "../sampleflow";
import Flow from "../flow";
import MyHome from "../myhome";
import Answers from "../answers";
import Answer from "../answer";
import Imports from "../imports";
import Alien from "../alien";
import Landing from "../landing";
import Exhibit from "../exhibit";
import Representation from "../representation";
import ExperimentalGroup from "../experimentalgroup";
import Questions from "../questions";
import Aliens from "../aliens";

class Wrapped extends Component {

    render() {
        return (
            <React.Fragment>
                <Header/>
                <div className="wrap nana">
                    <PrivateRoute path={`/experiment/:experimentid`} component={Experiment}/>
                    <PrivateRoute path={`/experimentalgroup/:groupid`} component={ExperimentalGroup}/>
                    <PrivateRoute path={`/alien/:nodeid/instance/:instanceid`} component={Alien}/>
                    <PrivateRoute path={`/aliens`} component={Aliens}/>
                    <PrivateRoute path={`/nodebuilder`} component={NodeBuilder}/>
                    <PrivateRoute path={`/nodes`} component={Nodes}/>
                    <PrivateRoute path={`/imports`} component={Imports}/>
                    <PrivateRoute path={`/organizer/:experimentid`} component={Organizer}/>
                    <PrivateRoute path={`/answers`} component={Answers}/>
                    <PrivateRoute path={`/answer/:answerid`} component={Answer}/>
                    <PrivateRoute path={`/node/:nodeid`} component={Node}/>
                    <PrivateRoute path={`/sample/:sampleid`} component={Sample}/>
                    <PrivateRoute path={`/roisforsample/:sampleid`} component={RoisForSample}/>
                    <PrivateRoute path={`/locker/:lockerid`} component={Locker}/>
                    <PrivateRoute path={`/lockers/:creatorid`} component={Lockers}/>
                    <PrivateRoute path={`/questions`} component={Questions}/>
                    <PrivateRoute path={`/representation/:representationid`} component={Representation}/>
                    <PrivateRoute path={`/bioseries/:bioseriesid`} component={BioSeries}/>
                    <PrivateRoute path={`/flowbuilder`} component={FlowBuilder}/>
                    <PrivateRoute path={`/bioimage/:bioimageid`} component={BioImage}/>
                    <PrivateRoute path={`/roi/:roiid`} component={Roi}/>
                    <PrivateRoute path={`/exhibit/:exhibitid`} component={Exhibit}/>
                    <PrivateRoute path={`/nodetester/:nodeid`} component={NodeTester}/>
                    <PrivateRoute path={`/latestroi/:userid`} component={LatestRoi}/>
                    <PrivateRoute path={`/display/:displayid`} component={Display}/>
                    <PrivateRoute path={`/displayflow/:flowid/display/:displayid`} component={DisplayFlow}/>
                    <PrivateRoute path={`/samplesflow/:flowid/sample/:sampleid`} component={SampleFlow}/>
                    <PrivateRoute path={`/lockerflow/:flowid/locker/:lockerid`} component={LockerFlow}/>
                    <PrivateRoute path={`/bioimageflow/:flowid/bioimage/:bioimageid`} component={BioImageFlow}/>
                    <PrivateRoute path={`/exhibitflow/:flowid/exhibit/:exhibitid`} component={ExhibitFlow}/>
                    <PrivateRoute path={`/flows`} component={Flow}/>
                    <Route path={`/landing`} component={Landing}/>
                    <PrivateRoute exact path={`/`} component={MyHome}/>

                </div>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default Wrapped;
