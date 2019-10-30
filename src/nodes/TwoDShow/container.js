import React, {Component} from 'react';

import {Button, Card, CardBody, CardHeader, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import Octicon, {ArrowRight, Plus} from "@githubprimer/octicons-react";
import TwoDShowComponent from "./TwoDShowComponent";
import NodeFrame from "../lib/NodeFrame";
import PopButton from "./PopButton";
import NonBlockingNodeFrame from "../lib/NonBlockingNodeFrame";


export class TwoDShow extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NonBlockingNodeFrame isGrid={this.props.isGrid} name={"TwoDShow"}>
                            <TwoDShowComponent/>
                    </NonBlockingNodeFrame>)
    }
}
