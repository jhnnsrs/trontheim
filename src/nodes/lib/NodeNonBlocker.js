import React from "react";
import {connectInstrument} from "../../alta/react";
import type {HortenEdge} from "../../alta/horten/edge";
import {Loader} from 'react-loaders';
import 'react-block-ui/style.css';
import 'loaders.css/loaders.min.css';
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




class NodeBlocker extends React.PureComponent<Props,State> {

    constructor(props){
        super(props);

    }

    render() {
            return (
                    <div>
                        {this.props.hasPopped ? <CardBody><div  class="mx-auto">Node has Popped</div></CardBody> : this.props.children}
                    </div>
                )
            }
}

const mapStavangerToProps = (stavanger: EdgeStavanger) => ({
    hasPopped: stavanger.edge.selectors.hasPopped,
});

const mapStavangerToDispatch  = (stavanger: EdgeStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NodeBlocker);