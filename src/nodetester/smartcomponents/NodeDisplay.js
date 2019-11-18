import React, {Component} from "react";
import type {NodeTesterStavanger} from "../stavanger";
import {Card} from "reactstrap";
import {connectInstrument, StavangerContext} from "../../alta/react";
import {NodeTestAsyncContainer} from "../../alta/react/Nodes";


// THIS IS CRUCIAL THAT IS IS A PURE COMPONENT
class Host extends React.PureComponent {

    render() {
        return <Card className="mt-2">
            <StavangerContext.Consumer>
                {parentStavanger => {
                    let NanaContainer = NodeTestAsyncContainer(this.props.node.nodeid, this.props.node.path, parentStavanger)
                    return <NanaContainer {...this.props}/>
                }}
            </StavangerContext.Consumer>
        </Card>
    }
}

class NodeDetailCard extends Component {

    render() {
        const {item} = this.props;
        if (item.data) {

            let node = { nodeid: "hsdfsdfallo", path: item.data.path}
            let props = {node: node, ...node}
            return (
                    <Host {...props}/>
            )
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: NodeTesterStavanger) => ({
    item: stavanger.node.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: NodeTesterStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NodeDetailCard);
