import {Button, ButtonGroup, Container} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import Form from "../../alta/react/FinalMold";
import type {CLusterEvaluator} from "./index";
import {Field} from "react-final-form";

class LineRectComponent extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                {this.props.transformation && <Container>Trans: {this.props.transformation.name}</Container>}
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

const mapStavangerToProps = (stavanger: CLusterEvaluator) => ({
    transformation: stavanger.transformation.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: CLusterEvaluator) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LineRectComponent);