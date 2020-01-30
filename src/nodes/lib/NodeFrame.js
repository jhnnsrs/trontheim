import {Card, CardBody, CardTitle} from "reactstrap";
import React from "react";
import type {HortenEdge} from "../../alta/horten/edge";
import NodeHeader from "./NodeHeader";
import {Loader} from 'react-loaders';
import NodeBlocker from "./NodeBlocker";

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

    constructor(props){
        super(props);
        this.state = {
            show: true
        }
        this.toggleShow = this.toggleShow.bind(this)

    }

    toggleShow() {
        this.setState({
            show: !this.state.show
        })
    }



    render() {
        if(this.state.show) {
            if(this.props.isGrid){
                return (
                <React.Fragment>
                    <NodeHeader name={this.props.name}/>
                    <NodeBlocker>
                        <CardBody className="overflow-auto">
                        {this.props.children}
                        </CardBody>
                    </NodeBlocker>
                </React.Fragment>
                    )
            }
            else return (
                <Card className="mt-2">
                    <CardBody>
                        <CardTitle onClick={this.toggleShow}>{this.props.name}</CardTitle>
                        {this.props.children}
                    </CardBody>
                </Card>)
        }
        else {
            if(this.props.isGrid){
                return (
                    <React.Fragment>
                        <NodeHeader name={this.props.name}/>
                    </React.Fragment>
                )
            }
            else return (
                <Card inverse className="mt-2 bg-dark">
                    <CardBody>
                        <CardTitle onClick={this.toggleShow}>{this.props.name}</CardTitle>
                    </CardBody>
                </Card>

            )
        }
    }
}
