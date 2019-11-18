import {Button, ButtonGroup, Card, CardTitle} from "reactstrap";
import React from "react";
import {FlowDiagram} from "./FlowDiagram";
import {connectInstrument} from "../../alta/react";
import type {FlowBuilderStavanger} from "../stavanger";
import ContentEditable from 'react-contenteditable-pattern'
import Form from "../../alta/react/FinalForm";
import {Field} from "react-final-form";

const renderContentEdit = ({ input, label, meta: { touched, error }, ...custom }) => {
    return (
        <ContentEditable {...input} {...custom} />
    )
}

class FlowDiagramInput extends React.Component {
    render() {
        const {
            input: { value, onChange }
        } = this.props;
        const updateFlow = () => {};
        const postDiagram = (diagram) => onChange(diagram);
        const destroyGraph = () => {};

        return (
            // We are wrapping this again to the Diagram in classic Structure
            <div>
                <FlowDiagram flow={{data: {diagram: value}}} postDiagram={postDiagram} destroyGraph={destroyGraph} updateFlow={updateFlow}/>

            </div>
        )
    }
}





const FlowBuilder = (props) => {
    return (
        <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }} className={"mt-2"}>
            <Form formHorten={"flowForm"} enableReinitialize={true}>
                {props =>
                    <React.Fragment>
                        <CardTitle>
                            <Field
                            style={{height: 20}}
                            name='name'
                            component={renderContentEdit}
                            spellCheck={false}/>
                        </CardTitle>
                        <Field
                            style={{minHeight: 20}}
                            name='description'
                            component={renderContentEdit}
                            spellCheck={false}
                        />
                        <Field name="diagram" component={FlowDiagramInput}/>
                        <Field name="update" id="employed" component="input" type="checkbox"/> Update?
                        <Field name="type" component="select">
                            <option value="generic">Generic</option>
                            <option value="representation">Representation</option>
                            <option value="display">Display</option>
                            <option value="sample">Sample</option>
                            <option value="locker">Locker</option>
                            <option value="exhibit">Exhibit</option>
                            <option value="bioseries">Bioseries</option>
                            <option value="bioimage">Bioimage</option>
                        </Field>
                        <ButtonGroup>
                            <Button type="submit" outline  size={"sm"}  className={"mx-auto"}>Save</Button>
                        </ButtonGroup>
                    </React.Fragment>
                }
            </Form>
        </Card>
    );
}

const mapStavangerToProps = (stavanger: FlowBuilderStavanger) => ({
});

const mapStavangerToDispatch  = (stavanger: FlowBuilderStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(FlowBuilder);