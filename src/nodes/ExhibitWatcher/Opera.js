import React, {Component} from 'react';

import {Button, Card, CardBody, CardHeader, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import Octicon, {ArrowRight, Plus} from "@githubprimer/octicons-react";
import StartButton from "./StartButton";
import NodeFrame from "../lib/NodeFrame";


class Opera extends Component {



    render() {
                return(
                    <NodeFrame name={"ExhibitWatcher"} isGrid={this.props.isGrid}>
                            <StartButton/>
                    </NodeFrame>)
    }
}

export default Opera