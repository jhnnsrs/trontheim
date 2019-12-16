import {CardHeader, Col, Container, Row} from "reactstrap";
import React from "react";
import "./frame.css"
import {connectInstrument} from "../../../alta/react";
import type {HortenEdge} from "../../../alta/horten/edge";
import PopButton from "../PopButton";
import type {HortenNode} from "../../../alta/horten/node";

type Props = {
    name: string,
    isGrid: boolean,

}

type State = {
    show: boolean,
}

type EdgeStavanger = {
    node: HortenNode
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

        let elements = [
            "MyHandle",
        ]

        return elements.join(" ")
    }




    render() {
            return(
                <CardHeader className="MyHandle small">
                    <Container fluid={true}>
                    <Row>
                        <Col className="col-auto mr-auto title">{this.props.node.name}</Col>
                        <Col className="col-auto title">{this.props.isPoppable && <PopButton/>}</Col>
                    </Row>
                    </Container>
                </CardHeader>
            )
    }
}

const mapStavangerToProps = (stavanger: EdgeStavanger) => ({
    isPoppable: (_) => stavanger.node.definition.isPoppable,
    node: stavanger.node.selectors.getState
});

const mapStavangerToDispatch  = (stavanger: EdgeStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NodeHeader);