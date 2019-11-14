import React, {Component} from 'react';

import {Col} from "reactstrap";
import RepresentationList from "./RepresentationList";
import NodeFrame from "../lib/NodeFrame";
import SentBioImages from "./SentBioImages";


export class ImageMutater extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"LockerIterator"}>
                        <Col>
                            <RepresentationList/>
                        </Col>
                        <Col>
                            <SentBioImages/>
                        </Col>
                    </NodeFrame>)
    }
}
