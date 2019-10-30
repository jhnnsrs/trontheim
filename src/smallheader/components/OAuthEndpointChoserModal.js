import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import _ from "lodash"
import sta  from "../stavanger";
import type {HeaderStavanger} from "../stavanger";
import {userSelector} from "../../rootMaestros";
import {connectInstrument} from "../../alta/react";

class OAuthEndpointChoserModal extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.props.toggleModal(!this.props.modalOpen)
    }



    render() {
        let { modalOpen, availableEndpoints, changeOslo} = this.props


        return (
            <Modal isOpen={modalOpen} className="text-center">
                <ModalHeader onClick={() => this.toggle()} >Choose Oslo Service</ModalHeader>
                <ModalBody>
                    <Row className="text-center">
                        {availableEndpoints.map(config =>
                            <Col key={_.uniqueId()}>
                                <Button outline onClick={() => changeOslo(config)}><p><img src={config.image} className={"oslologo"}/></p>{config.name}</Button>
                            </Col>)
                        }
                    </Row>
                    <Row className="text-center">
                        <br/>
                        <p> Please choose your institutions server. Be aware that migration between services might not always work flawlessly. Beta is considered unstable</p>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="danger" onClick={() => this.toggle()}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStavangerToProps = (stavanger: HeaderStavanger) => ({
    availableEndpoints: stavanger.oauth.selectors.getAvailableEndpoints,
    modalOpen: stavanger.page.selectors.getProp(item => item.modalOpen)
});

const mapStavangerToDispatch  = (stavanger: HeaderStavanger) =>  ({
    changeOslo: (config) => stavanger.oauth.model.changeEndpointAndLogin.request(config),
    toggleModal: (it) => stavanger.page.model.setProp.request({ key: "modalOpen", value: it})
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(OAuthEndpointChoserModal);
