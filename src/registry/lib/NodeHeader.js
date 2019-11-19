import {CardHeader, Col, Row} from "reactstrap";
import React from "react";
import {connectInstrument} from "../../alta/react";
import type {HortenEdge} from "../../alta/horten/edge";
import PopButton from "./PopButton";
import AlienButton from "./AlienButton";

type Props = {
    name: string,
    isGrid: boolean,

}

type State = {
    show: boolean,
}

type EdgeStavanger = {
    node: HortenEdge
}




class NodeHeader extends React.Component<Props,State> {

    constructor(props){
        super(props);
        this.state = {
            show: true
        }
        this.getclassName = this.getclassName.bind(this)

    }



    getclassName() {
        let progress = this.props.edge.progress ? "text-success" : "text-secondary"
        progress = this.props.edge.attention ? "text-danger" : progress

        let elements = [
            "MyHandle",
            progress
        ]

        return elements.join(" ")
    }




    render() {
            return(<CardHeader className={this.getclassName()}>
                <Row>
                    <Col className="col-auto mr-auto">{this.props.edge.name}</Col>
                    <Col>{this.props.edge.attention && this.props.edge.attention}</Col>

                    {this.props.isPoppable && <Col><PopButton/></Col>}
                </Row>
            </CardHeader>)
    }
}

const mapStavangerToProps = (stavanger: EdgeStavanger) => ({
    edge: stavanger.node.selectors.getModel,
    isPoppable: (_) => stavanger.node.definition.isPoppable
});

const mapStavangerToDispatch  = (stavanger: EdgeStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NodeHeader);