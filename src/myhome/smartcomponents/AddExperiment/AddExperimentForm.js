import React from 'react'
import {Button, ModalBody, ModalFooter} from "reactstrap";
import FinalMold from "../../../alta/react/FinalMold";
import {Field} from "react-final-form";
import {renderFileField, renderInputField, renderTextField} from "../../../generics/Fields";


let AddExperimentForm = (ownProps) => {
    return (
        <FinalMold mold={"experimentForm"}>
            { (props) =>
                <React.Fragment>
                <ModalBody>
                    <Field key={1} name={"name"} component={renderInputField} type={"name"} label={"Name"}/>
                    <Field key={2} name={"description"} component={renderTextField} type={"name"} label={"Description"}/>
                    <Field key={3} name={"file"} component={renderFileField} type={"name"} label={"Description"}/>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" type="submit">Add Experiment</Button>{' '}
                    <Button color="secondary" onClick={ownProps.toggle}>Cancel</Button>
                </ModalFooter>
                </React.Fragment>
            }
        </FinalMold>
    );
}

export default AddExperimentForm