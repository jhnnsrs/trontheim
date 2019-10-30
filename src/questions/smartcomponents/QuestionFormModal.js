import React from "react";
import {Field} from "react-final-form";
import {Button, ButtonGroup, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import AddExperimentForm from "../../myhome/smartcomponents/AddExperiment/AddExperimentForm";
import type {BioConverterStavanger} from "../../nodes/BioConverter";
import {connectInstrument} from "../../alta/react";
import type {QuestionsStavanger} from "../stavanger";

import Form from "../../alta/react/FinalMold";
import {renderInputField, renderTextField} from "../../generics/Fields";

class QuestionFormModal extends React.Component {
    render() {
        const { isOpen, toggle, closeModal} = this.props;
        return (
            <Modal isOpen={isOpen}>
                <ModalHeader onClick={() => closeModal()}>Add Question</ModalHeader>
                <Form mold={"newQuestion"} enableReinitilaize={true}>
                    {props => <React.Fragment>
                        <ModalBody>
                            <Field key={1} name={"name"} component={renderInputField} type={"name"} label={"Name"}/>
                            <Field key={2} name={"querystring"} component={renderTextField} type={"name"} label={"Your Query"}
                            description={"Please checkout the GraphQL Playground and insert your request here"}/>
                        </ModalBody>
                        <ModalFooter>
                            <ButtonGroup>
                                <Button type="submit" outline  color="primary" size={"sm"}  >Add Question</Button>
                                <Button color="danger" outline onClick={() => closeModal()}  size={"sm"} >Cancel</Button>
                            </ButtonGroup>
                        </ModalFooter>
                    </React.Fragment>}
                </Form>
            </Modal>
        );
    }
}

const mapStavangerToProps = (stavanger: QuestionsStavanger) => ({
    isOpen: stavanger.page.selectors.getProp(item => item.modalOpen)

});

const mapStavangerToDispatch  = (stavanger: QuestionsStavanger) =>  ({
    closeModal: () => stavanger.page.model.setProp.request({key: "modalOpen", value: false})
});

export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(QuestionFormModal);