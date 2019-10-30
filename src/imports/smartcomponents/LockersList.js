import React, {Component} from "react";
import type {ImportsStavanger, SampleStavanger} from "../stavanger";
import {
    Button, ButtonGroup,
    Card,
    CardBody,
    CardImg,
    CardImgOverlay,
    CardSubtitle,
    CardText,
    CardTitle, Col,
    Container, Row
} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import Octicon, {Plus} from "@githubprimer/octicons-react";
import * as _ from "lodash"
import ButtonToNavigate from "../../generics/ButtonToNavigate";
import {Link} from "react-router-dom";

class Bioimages extends Component {

    render() {
        const {lockers} = this.props;
        if (lockers.data) {
            return (
                <React.Fragment>
                {lockers.data.map((locker, index) =>
                        <Card className="mt-2 overflow-auto" key={locker.data.id} onClick={() => this.props.selectBioimage(locker)}>
                            <CardBody>
                                <CardTitle>
                                    <Row>
                                        <Col className="col-auto mr-auto"><Link className="align-self-center" to={"/locker/"+locker.data.id}>{locker.data.name}</Link></Col>
                                        <Col className="col-auto"><Button outline size={"sm"} onClick={() => this.props.deleteItem(locker)}> Del </Button> </Col>
                                    </Row>
                                </CardTitle>
                                <CardSubtitle>Locker in Location '{locker.data.location}'</CardSubtitle>
                                <ButtonGroup>
                                    <Button outline size="sm" onClick={() => this.props.selectBioimage(locker)}>Open</Button>
                                </ButtonGroup>
                            </CardBody>
                        </Card>)}
                </React.Fragment>
            );
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: ImportsStavanger) => ({
    lockers: stavanger.lockers.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: ImportsStavanger) =>  ({
    selectBioimage: (locker) => stavanger.lockers.model.selectItem.request(locker),
    deleteItem: (locker) => stavanger.lockers.model.deleteItem.request(locker),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Bioimages);
