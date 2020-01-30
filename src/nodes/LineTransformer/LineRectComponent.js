import {Button, ButtonGroup, Container} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import Form from "../../alta/react/FinalMold";
import type {SliceLineTransformer} from "./index";
import {Field} from "react-final-form";

class LineRectComponent extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                {this.props.repin && <Container>Rep: {this.props.repin.name}</Container>}
                {this.props.slice && <Container>Upper: {this.props.slice.upper}</Container>}
                {this.props.slice && <Container>Lower: {this.props.slice.lower}</Container>}
                {this.props.roi && <Container>Roi: {this.props.roi.id}</Container>}
                <Form mold={"settings"} enableRe={true}>
                    {props => <React.Fragment>
                        <Field
                        name="scale"
                        component="input"
                        type="text"
                        placeholder="Scale in Pixels"
                    />
                    <div>
                        <label>Overwrite</label>
                        <Field name="overwrite" component="input" type="checkbox" />
                    </div>
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
    slice: stavanger.slice.selectors.getData,
    roi: stavanger.roi.selectors.getData
});

const mapStavangerToDispatch  = (stavanger: SliceLineTransformer) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LineRectComponent);