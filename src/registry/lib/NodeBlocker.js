import React from "react";
import {connectInstrument} from "../../alta/react";
import type {HortenEdge} from "../../alta/horten/edge";
import BlockUi from "react-block-ui";
import {Loader} from 'react-loaders';
import 'react-block-ui/style.css';
import 'loaders.css/loaders.min.css';
import {SERVER, WAITING} from "../../constants/nodestatus";
import {CardBody} from "reactstrap";

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




class NodeBlocker extends React.Component<Props,State> {

    constructor(props){
        super(props);
        this.getBlockState = this.getBlockState.bind(this)

    }



    getBlockState(edge) {
        let {code, message} = edge.status
        message = message ? message: ""
        let standard = "ball-grid-pulse"
        let standardcolor = "#02a17c"
        let errorcolor = "#cc0000"

        switch (code) {
            case WAITING.initialWait: return {state: false, message: message, loader: standard, color: standardcolor}
            case WAITING.waitingForInput: return {state: false, message: message, loader: standard, color: standardcolor}
            case SERVER.serverError: return {state: true, message: message, loader: "pacman", color: errorcolor}
            case SERVER.serverPost: return {state: true, message: "Queued", loader: standard, color: standardcolor}
            case SERVER.serverProgress: return {state: true , message: message, loader: standard, color: standardcolor}
            default: return {state: false , message: null, loader: standard, color: standardcolor}
        }



    }




    render() {
            let edge = this.props.edge
            if (edge) {
                let { state, message, loader, color} = this.getBlockState(edge)
                let hasPopped = edge.hasPopped

                return (
                    <div><BlockUi tag="div" blocking={state} message={message}
                                 loader={<Loader active type={loader}
                                                 color={color}/>} keepInView>
                        {hasPopped ? <CardBody><div  class="mx-auto">Node has Popped</div></CardBody> : this.props.children}
                    </BlockUi>
                    </div>
                )
            }
            else return ""
    }
}

const mapStavangerToProps = (stavanger: EdgeStavanger) => ({
    edge: stavanger.node.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: EdgeStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NodeBlocker);