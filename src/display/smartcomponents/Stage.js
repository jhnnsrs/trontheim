import React, {useState} from "react";
import {Button, Card, CardBody, CardTitle, Col, Row} from "reactstrap";
import {CanvasCreator} from "../../canvas/Canvas";
import {RoisCreator} from "../../canvas/Rois";
import {DisplayCreator} from "../../canvas/Display";
import {RoiCreator} from "../../canvas/Roi";

const Canvas = CanvasCreator(stavanger => stavanger.canvas, stavanger => stavanger.display)
const Display = DisplayCreator(stavanger => stavanger.display)
const Rois = RoisCreator(stavanger => stavanger.rois)
const Roi = RoiCreator(stavanger => stavanger.selectedRoi)


const Stage = (props) => {

    const [showAll, setShowAll] = useState(false);


    return (
        <Card>
            <CardBody>
                <CardTitle>
                    <Row>
                        <Col className="col-auto mr-auto">State</Col>
                        <Col className="col-auto"><Button
                            onClick={() => setShowAll(!showAll)}>{!showAll ? "Show All" : "Hide All"}</Button> </Col>
                    </Row>
                </CardTitle>
                <Canvas detectWheel={false}>
                    <Display/>
                    {showAll ? <Rois/> : <Roi/>}
                </Canvas>
            </CardBody>
        </Card>
    );
}


export default Stage
