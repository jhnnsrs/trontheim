import {Button, ButtonGroup} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import Form from "../../alta/react/FinalForm";
import type {BioConverterStavanger} from "./index";
import {Field} from "react-final-form";

class ImageMutaterComponent extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                <Form formHorten={"settings"} enableReinitilaize={true}>
                    {props => <React.Fragment>
                        <Field
                        name="scale"
                        component="input"
                        type="text"
                        placeholder="Scale in Pixels"
                        />
                        <ButtonGroup>
                            <Button type="submit" outline  size={"sm"}  className={"mx-auto"}>Save</Button>
                        </ButtonGroup>
                    </React.Fragment>
                        }
                </Form>
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: BioConverterStavanger) => ({
});

const mapStavangerToDispatch  = (stavanger: BioConverterStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ImageMutaterComponent);