import React, {Component} from 'react';

import {Button, Card, CardBody, CardHeader, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import Octicon, {ArrowRight, Plus} from "@githubprimer/octicons-react";
import NodeFrame from "../lib/NodeFrame";
import FilterOptions from "./FilterOptions";


class Opera extends Component {



    render() {
                return(
                    <NodeFrame name={"BioSeriesFilter"} isGrid={this.props.isGrid}>
                            <FilterOptions/>
                    </NodeFrame>)
    }
}

export default Opera