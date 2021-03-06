import {CardBody} from "reactstrap";
import React from "react";
import type {HortenEdge} from "../../../alta/horten/edge";
import NodeHeader from "./NodeHeader";
import {Loader} from 'react-loaders';
import NodeNonBlocker from "../NodeNonBlocker";

type Props = {
    name: string,
    isGrid: boolean,

}

type State = {
    show: boolean,
}

type EdgeStavanger = {
    edge: HortenEdge
}




export default class NodeFrame extends React.Component<Props,State> {

    constructor(props) {
        super(props);
    }



    render() {
        return (
                <React.Fragment>
                    <NodeHeader name={this.props.name}/>
                    <NodeNonBlocker>
                        <CardBody className="overflow-auto">
                        {this.props.children}
                        </CardBody>
                    </NodeNonBlocker>
                </React.Fragment>
                    )

    }


}
