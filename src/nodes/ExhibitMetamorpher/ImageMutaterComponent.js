import {Button, ButtonGroup} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import Form from "../../alta/react/FinalForm";
import type {BioConverterStavanger} from "./index";
import {Field} from "react-final-form";
import {renderCheckInput} from "../../generics/Fields";

class ImageMutaterComponent extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                <Form formHorten={"settings"} enableReinitilaize={true}>
                    {props => <React.Fragment>
                        <Field key={3} name={"rescale"} size="sm" component={renderCheckInput} truevalue={"Rescale"} falsevalue={"Dont Rescale"} colorcode={true} type={"name"} label={"Rescaling"}
                               description={"With this enabled the 3D Max intensity will match the Max Value in the BioImage File (Enable for ND)"}/>
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