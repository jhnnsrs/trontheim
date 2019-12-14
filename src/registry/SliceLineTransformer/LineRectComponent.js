import {Button, ButtonGroup, Container} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import Form from "../../alta/react/FinalMold";
import type {SliceLineTransformer} from "./index";
import {Field} from "react-final-form";
import {renderMultiSelect, renderMultiSelectBuilder} from "../../generics/Fields";

class LineRectComponent extends Component<any,any> {
    render() {

        let ports = this.props.state.ports
        console.log(ports)
        let filteredports = ports.filter(port=> port.in).map(port => ({value: port.label, label: port.label}))
        return (
            <React.Fragment>
                {this.props.repin && <Container>Rep: {this.props.repin.name}</Container>}
                {this.props.roi && <Container>Roi: {this.props.roi.id}</Container>}
                {this.props.slice && <Container>Slice: {this.props.slice.upper}</Container>}
                <Form mold={"settings"} enableRe={true}>
                    {props => <React.Fragment>
                        {filteredports &&
                        <Field
                            name="initiators"
                            component={renderMultiSelect(filteredports)}
                            label={"Initiators"}
                            description={"These items when updated will cause the node to fire"}
                            type="text"
                            placeholder="Scale in Pixels"
                        />
                        }
                    <ButtonGroup>
                        <Button type="submit" outline  size={"sm"}  className={"mx-auto"}>Save</Button>
                    </ButtonGroup>
                        </React.Fragment>}
                </Form>
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: SliceLineTransformer) => ({
    repin: stavanger.representation.selectors.getData,
    roi: stavanger.roi.selectors.getData,
    slice: stavanger.slice.selectors.getData,
    state: stavanger.node.selectors.getState
});

const mapStavangerToDispatch  = (stavanger: SliceLineTransformer) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LineRectComponent);