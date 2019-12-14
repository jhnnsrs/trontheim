import {CardHeader, Col, Row} from "reactstrap";
import React from "react";
import {connectInstrument} from "../../../alta/react";
import type {HortenEdge} from "../../../alta/horten/edge";
import PopButton from "../PopButton";

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

        let elements = [
            "MyHandle",
        ]

        return elements.join(" ")
    }




    render() {
            return(
                <CardHeader className={this.getclassName()}>
                    <Row>
                        {this.props.isPoppable && <Col className="col-auto ml-auto"><PopButton/></Col>}
                    </Row>
                </CardHeader>
            )
    }
}

const mapStavangerToProps = (stavanger: EdgeStavanger) => ({
    isPoppable: (_) => stavanger.node.definition.isPoppable
});

const mapStavangerToDispatch  = (stavanger: EdgeStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NodeHeader);