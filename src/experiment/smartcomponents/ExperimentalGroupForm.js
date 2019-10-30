import React from "react";
import {Field} from "react-final-form";
import {Button, ButtonGroup, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {connectInstrument} from "../../alta/react";

import Form from "../../alta/react/FinalMold";
import {renderCheckInput, renderInputField, renderTextField} from "../../generics/Fields";
import type {ExperimentStavanger} from "../stavanger";

class QuestionFormModal extends React.Component {
    render() {
        const { isOpen, toggle, closeModal} = this.props;
        return (
            <Modal isOpen={isOpen}>
                <ModalHeader onClick={() => closeModal()}>Add Question</ModalHeader>
                <Form mold={"newGroup"} enableReinitilaize={true}>
                    {props => <React.Fragment>
                        <ModalBody>
                            <Field key={1} name={"name"} component={renderInputField} type={"name"} label={"Name"}/>
                            <Field key={2} name={"description"} component={renderTextField} type={"name"} label={"Description"}
                            description={"Describe it!"}/>
                            <Field key={3} name={"iscontrol"} component={renderCheckInput} truevalue={"Control"} falsevalue={"No Control"} colorcode={true} type={"name"} label={"Control?"}
                                   description={"Is this Experimental Group a Control?"}/>
                        </ModalBody>
                        <ModalFooter>
                            <ButtonGroup>
                                <Button type="submit" outline  color="primary" size={"sm"}  >Add Group</Button>
                                <Button color="danger" outline onClick={() => closeModal()}  size={"sm"} >Cancel</Button>
                            </ButtonGroup>
                        </ModalFooter>
                    </React.Fragment>}
                </Form>
            </Modal>
        );
    }
}

const mapStavangerToProps = (stavanger: ExperimentStavanger) => ({
    isOpen: stavanger.page.selectors.getProp(item => item.modalOpen)

});

const mapStavangerToDispatch  = (stavanger: ExperimentStavanger) =>  ({
    closeModal: () => stavanger.page.model.setProp.request({key: "modalOpen", value: false})
});

export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(QuestionFormModal);