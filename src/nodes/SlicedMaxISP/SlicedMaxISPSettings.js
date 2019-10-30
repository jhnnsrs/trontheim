import {Button, ButtonGroup, CardBody, CardText} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import Form from "../../alta/react/FinalForm";
import type {SlicedMaxISPStavanger} from "./index";
import {Field} from "react-final-form";

class SlicedMaxISP extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                <Form formHorten={"settings"} enableReinitilaize={true}>
                    {props => <React.Fragment>
                        <Field
                        name="upper"
                        component="input"
                        type="text"
                        placeholder="Scale in Pixels"
                    />
                        <Field
                            name="lower"
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

const mapStavangerToProps = (stavanger: SlicedMaxISPStavanger) => ({
});

const mapStavangerToDispatch  = (stavanger: SlicedMaxISPStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SlicedMaxISP);