import React from "react";
import {Field} from "react-final-form";
import {Button, ButtonGroup, Modal, ModalHeader} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {AnswersStavanger} from "../stavanger";

import Form from "../../alta/react/FinalMold";

class QuestionFormModal extends React.Component {
    render() {
        const { isOpen, toggle, closeModal} = this.props;
        return (
            <Modal isOpen={isOpen}>
                <ModalHeader onClick={() => closeModal()}>Add Locker</ModalHeader>
                <Form mold={"newQuestion"} enableReinitilaize={true}>
                    {props => <React.Fragment>
                        <Field
                            name="name"
                            component="input"
                            type="text"
                            placeholder="Name"
                        /><br/>
                        <Field
                            name="querystring"
                            component="input"
                            type="text"
                            placeholder="Querystring"
                        /><br/>
                        <ButtonGroup>
                            <Button type="submit" outline  size={"sm"}  className={"mx-auto"}>Save</Button>
                            <Button  onClick={() => closeModal()}  size={"sm"}  className={"mx-auto"}>Cancel</Button>
                        </ButtonGroup>
                    </React.Fragment>}
                </Form>
            </Modal>
        );
    }
}

const mapStavangerToProps = (stavanger: AnswersStavanger) => ({
    isOpen: stavanger.page.selectors.getProp(item => item.modalOpen)

});

const mapStavangerToDispatch  = (stavanger: AnswersStavanger) =>  ({
    closeModal: () => stavanger.page.model.setProp.request({key: "modalOpen", value: false})
});

export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(QuestionFormModal);