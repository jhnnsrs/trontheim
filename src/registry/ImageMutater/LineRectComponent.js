import {Button, ButtonGroup, Container} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import Form from "../../alta/react/FinalMold";
import type {TransformationMutater} from "./index";
import {Field} from "react-final-form";
import {renderCheckInput} from "../../generics/Fields";

class LineRectComponent extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                {this.props.transformation && <Container>Representation IN: {this.props.transformation.name}</Container>}
                <Form mold={"settings"} enableReinitilaize={true}>
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

const mapStavangerToProps = (stavanger: TransformationMutater) => ({
    transformation: stavanger.transformation.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: TransformationMutater) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LineRectComponent);