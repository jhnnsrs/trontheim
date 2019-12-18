import React from "react";
import {Field} from "react-final-form";
import {Button, ButtonGroup, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {NodeItemsStavanger} from "../stavanger";
import Form from "../../alta/react/FinalMold";
import {getChannels, getModels, getNodeClass} from "../../constants/models";
import {renderInputField, renderMultiSelectBuilder, renderSingleSelectBuilder} from "../../generics/Fields";

class NodeFormModal extends React.Component {
    render() {
        const { isOpen, toggle, closeModal} = this.props;
        let models = getModels()
        let channels = getChannels()
        let nodeclasses = getNodeClass()
        return (
            <Modal isOpen={isOpen}>
                <ModalHeader onClick={() => closeModal()}>Add Node</ModalHeader>
                <Form mold={"newNode"} enableReinitilaize={true}>
                    {props => <React.Fragment>
                        <ModalBody>
                        <Field label={"Name"} name="name" component={renderInputField} type="text" placeholder="Name of Node"
                        />
                            <Field
                                label={"Path Location"}
                                name="path"
                                component={renderInputField}
                                type="text"
                                placeholder="Exact Path Location"
                            />
                            <Field
                                label = "Default Settings"
                                name="defaultsettings"
                                component={renderInputField}
                                type="text"
                                placeholder="Default Settings"
                            />
                            <Field
                                label = {"Entity"}
                                name="entityid"
                                component={renderInputField}
                                type="number"
                                placeholder="Entity ID"
                            />
                            <Field
                                name="nodeclass"
                                component={renderSingleSelectBuilder(nodeclasses)}
                                label={"Node-Class"}
                                type="text"
                                placeholder="Scale in Pixels"
                            />
                            <Field
                                name="inputmodel"
                                component={renderMultiSelectBuilder(models.map(item => item.model))}
                                label={"Input"}
                                description={"These Items will be set as inputs for the node"}
                                type="text"
                            />
                            <Field
                                name="outputmodel"
                                component={renderMultiSelectBuilder(models.map(item => item.model))}
                                label={"Output"}
                                description={"These Items will be set as inputs for the node"}
                                type="text"
                            />
                        </ModalBody>
                        <ModalFooter>
                        <ButtonGroup>
                            <Button type="submit" outline  size={"sm"}  className={"mx-auto"}>Save</Button>
                            <Button  onClick={() => closeModal()}  size={"sm"}  className={"mx-auto"}>Cancel</Button>
                        </ButtonGroup>
                        </ModalFooter>
                    </React.Fragment>}
                </Form>
            </Modal>
        );
    }
}

const mapStavangerToProps = (stavanger: NodeItemsStavanger) => ({
    isOpen: stavanger.page.selectors.getProp(item => item.modalOpen),

});

const mapStavangerToDispatch  = (stavanger: NodeItemsStavanger) =>  ({
    closeModal: () => stavanger.page.model.setProp.request({key: "modalOpen", value: false})
});

export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NodeFormModal);