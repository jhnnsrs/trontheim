import {Button, ButtonGroup, CardBody, CardText, Container} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import Form from "../../alta/react/FinalForm";
import type {BioMetaStavanger} from "./index";
import {Field} from "react-final-form";

class LineRectComponent extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                {this.props.bioimage && <Container>{this.props.bioimage.name}</Container>}
                <Form formHorten={"settings"} enableReinitilaize={true}>
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

const mapStavangerToProps = (stavanger: BioMetaStavanger) => ({
    bioimage: stavanger.bioimage.selectors.getData
});

const mapStavangerToDispatch  = (stavanger: BioMetaStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LineRectComponent);