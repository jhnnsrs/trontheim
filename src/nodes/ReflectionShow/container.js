import React, {Component} from 'react';

import {Button, Card, CardBody, CardHeader, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import Octicon, {ArrowRight, Plus} from "@githubprimer/octicons-react";
import NodeFrame from "../lib/NodeFrame";
import ReflectionShowComponent from "./ReflectionShowComponent";


export class TwoDShow extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"ReflectionShow"}>
                            <ReflectionShowComponent/>
                    </NodeFrame>)
    }
}
