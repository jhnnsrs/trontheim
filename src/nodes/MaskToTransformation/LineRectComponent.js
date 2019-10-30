import {Button, ButtonGroup, CardBody, CardText, Container} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import Form from "../../alta/react/FinalMold";
import type {MaskMasking} from "./index";
import {Field} from "react-final-form";

class LineRectComponent extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                {this.props.transin && <Container>{this.props.transin.id}</Container>}
                {this.props.maskin && <Container>{this.props.maskin.id}</Container>}
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

const mapStavangerToProps = (stavanger: MaskMasking) => ({
    transin: stavanger.transformation.selectors.getData,
    maskin: stavanger.mask.selectors.getData
});

const mapStavangerToDispatch  = (stavanger: MaskMasking) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LineRectComponent);