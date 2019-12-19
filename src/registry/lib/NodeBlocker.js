import React from "react";
import {connectInstrument} from "../../alta/react";
import type {HortenEdge} from "../../alta/horten/edge";
import BlockUi from "react-block-ui";
import {Loader} from 'react-loaders';
import 'react-block-ui/style.css';
import 'loaders.css/loaders.min.css';
import {SERVER, WAITING} from "../../constants/nodestatus";
import {CardBody, Col, Container, Row} from "reactstrap";
import type {NodeStavanger} from "./types";
import {LARVIKDONE, LARVIKERROR, LARVIKSTARTED, LAVRIKPROGRESS} from "../../constants/larvikstatus";
import "./blockuiextenders.css"
import styled from "styled-components"

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

const Error = styled.span`
    color: "#cc0000"
`

class NodeBlocker extends React.Component<Props,State> {

    constructor(props){
        super(props);
        this.getBlockState = this.getBlockState.bind(this)
        this.buildLoader = this.buildLoader.bind(this)
        this.buildError = this.buildError.bind(this)

    }

    buildLoader(loader,color) {

        return <Container fluid={true}>
            <Row>
                <Col className="mx-auto" style={{maxWidth: "fit-content"}}><Loader className="mx-auto" active type={loader} color={color}/></Col></Row></Container>
    }

    buildError(loader,color) {

        return <Container fluid={true}>
            <Row>
                <Col className="mx-auto" style={{maxWidth: "fit-content"}}><Error>&#9888;</Error></Col></Row></Container>
    }

    getBlockState(status) {
        let {code, message} = status
        message = message ? message: ""
        let standard = "ball-grid-pulse"
        let standardcolor = "#02a17c"
        let servercolor = "#9449a1"
        let errorcolor = "#cc0000"

        switch (code) {
            case WAITING.initialWait: return {state: false, message: message, loader: this.buildLoader(standard,standardcolor), color: standardcolor}
            case WAITING.waitingForInput: return {state: false, message: message, loader:  this.buildLoader(standard,standardcolor), color: standardcolor}
            case SERVER.serverError: return {state: true, message: message, loader:  this.buildLoader(standard,errorcolor), color: errorcolor}
            case SERVER.serverPost: return {state: true, message: "Queued", loader: this.buildLoader(standard,standardcolor), color: standardcolor}
            case SERVER.serverProgress: return {state: true , message: message, loader:  this.buildLoader(standard,standardcolor), color: standardcolor}
            case LARVIKERROR: return {state: true , message: message, loader:  this.buildError(standard,standardcolor), color: errorcolor}
            case LARVIKSTARTED: return {state: true , message: message, loader:  this.buildLoader(standard,servercolor), color: servercolor}
            case LAVRIKPROGRESS: return {state: true , message: message, loader:  this.buildLoader(standard,servercolor), color: servercolor}
            case LARVIKDONE: return {state: false , message: message, loader:  this.buildLoader(standard,servercolor), color: servercolor}
            default: return {state: false , message: null, loader:  this.buildLoader(standard,standardcolor), color: standardcolor}
        }



    }




    render() {
            let {status, isPopped} = this.props
            if (status) {
                let { state, message, loader, color} = this.getBlockState(status)

                return (
                    <div className={this.props.bodyClassName}>
                        <BlockUi tag="div" blocking={state} message={message}
                                 loader={loader} keepInView>
                        {isPopped ? <CardBody><div  className="mx-auto">Node has Popped</div></CardBody> : this.props.children}
                        </BlockUi>
                    </div>
                )
            }
            else return ""
    }
}

const mapStavangerToProps = (stavanger: NodeStavanger) => ({
    status: stavanger.node.selectors.getStatus,
    isPopped: stavanger.node.selectors.isPopped
});

const mapStavangerToDispatch  = (stavanger: EdgeStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NodeBlocker);