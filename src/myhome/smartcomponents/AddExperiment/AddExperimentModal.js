import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AddExperimentForm from "./AddExperimentForm";
import type {HomeStavanger} from "../../stavanger";
import {connectInstrument} from "../../../alta/react";
import {AddExperimentCard} from "./AddExperimentCard";

class AddExperimentModal extends React.Component {
    render() {
        const { isOpen, closeModal} = this.props;
        return (
                <Modal isOpen={isOpen}>
                    <ModalHeader>Add Experiment</ModalHeader>
                    <AddExperimentForm toggle={closeModal}/>
                </Modal>
        );
    }
}

const mapStavangerToProps = (stavanger: HomeStavanger) => ({
    isOpen: stavanger.page.selectors.getProp(item => item.modalOpen),
});

const mapStavangerToDispatch  = (stavanger: HomeStavanger) =>  ({
    closeModal: (item) => stavanger.page.model.setProp.request({key: "modalOpen", value: false})
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(AddExperimentModal);