import React, {Component} from 'react';

import {Button, Card, CardBody, CardHeader, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import Octicon, {ArrowRight, Plus} from "@githubprimer/octicons-react";
import SlicedMaxISPSettings from "./SlicedMaxISPSettings";
import NodeFrame from "../lib/NodeFrame";


export class MaxISP extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"MaxISP"}>
                            <SlicedMaxISPSettings/>
                    </NodeFrame>)
    }
}
