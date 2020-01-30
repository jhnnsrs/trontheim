import React, {Component} from "react";
import type {NodeTesterStavanger} from "../stavanger";
import {Button, Card} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class Inputs extends Component {

    render() {
        const {item} = this.props;
        if (item.data) {
            const inputs = JSON.parse(item.data.inputmodel)
            const outputs = JSON.parse(item.data.outputmodel)

            return(
                <Card>
                    {inputs.map(item => <Button onClick={(event) => this.props.loadInput(item)}> {item} </Button>)}



                </Card>
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
    loadInput: (inputname) => stavanger.page.model.dynamic("LOAD_INPUT").request(inputname),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Inputs);
