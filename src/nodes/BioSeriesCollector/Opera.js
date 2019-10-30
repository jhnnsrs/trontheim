import React, {Component} from 'react';

import {Button, Card, CardBody, CardHeader, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import Octicon, {ArrowRight, Plus} from "@githubprimer/octicons-react";
import NodeFrame from "../lib/NodeFrame";
import BioSeriesList from "./BioSeriesList";


class Opera extends Component {



    render() {
                return(
                    <NodeFrame name={"BioSeriesCollector"} isGrid={this.props.isGrid}>
                            <BioSeriesList/>
                    </NodeFrame>)
    }
}

export default Opera