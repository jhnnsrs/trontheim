import React from "react";
import {Field} from "react-final-form";
import {Button, ButtonGroup, Modal, ModalHeader} from "reactstrap";
import AddExperimentForm from "../../myhome/smartcomponents/AddExperiment/AddExperimentForm";
import type {BioConverterStavanger} from "../../nodes/BioConverter";
import {connectInstrument} from "../../alta/react";
import type {ImportsStavanger} from "../stavanger";

import Form from "../../alta/react/FinalMold";

class LockerFormModal extends React.Component {
    render() {
        const { isOpen, toggle, closeModal} = this.props;
        return (
            <Modal isOpen={isOpen}>
                <ModalHeader onClick={() => closeModal()}>Add Locker</ModalHeader>
                <Form mold={"newLocker"} enableReinitilaize={true}>
                    {props => <React.Fragment>
                        <Field
                            name="name"
                            component="input"
                            type="text"
                            placeholder="Name"
                        /><br/>
                        <Field
                            name="location"
                            component="input"
                            type="text"
                            placeholder="Location"
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

const mapStavangerToProps = (stavanger: ImportsStavanger) => ({
    isOpen: stavanger.page.selectors.getProp(item => item.modalOpen)

});

const mapStavangerToDispatch  = (stavanger: ImportsStavanger) =>  ({
    closeModal: () => stavanger.page.model.setProp.request({key: "modalOpen", value: false})
});

export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LockerFormModal);