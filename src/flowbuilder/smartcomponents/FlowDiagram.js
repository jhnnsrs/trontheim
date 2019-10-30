import React, {Component} from "react";
import DiagramApp from "../graph/DiagramApp";
import {
    NodeSpawnModel
} from "../graph/NodeModels";
import {DiagramModel, DiagramWidget} from "storm-react-diagrams";
import {Button, ButtonGroup, Container} from "reactstrap";
import {connect} from "react-redux";

export class FlowDiagram extends Component {


    constructor(props){
        super(props)
        this.app = new DiagramApp(() => {})
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.flow.data.diagram !== this.props.flow.data.diagram) {
            this.loadFromDiagram(nextProps.flow.data.diagram);
        }
    }

    handleDrop = event => {



        let node
        try {
            node = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
        }
        catch (e) {
            return
        }

        let spawnedNode
        console.log("Trying to spawn node of type",node.data.nodeclass)
        if (node.data.nodeclass) {
            spawnedNode = new NodeSpawnModel(node.data.nodeclass, node);
        }
        else return




        let points = this.app.getDiagramEngine().getRelativeMousePoint(event);
        spawnedNode.x = points.x;
        spawnedNode.y = points.y;
        this.app
            .getDiagramEngine()
            .getDiagramModel()
            .addNode(spawnedNode);

        this.forceUpdate();

    };

    saveDiagram () {
        let serialized = this.app.getDiagramEngine().getDiagramModel().serializeDiagram()
        this.props.postDiagram(serialized)
    }

    updateFlow () {
        let serialized = this.app.getDiagramEngine().getDiagramModel().serializeDiagram()
        this.props.updateFlow(serialized)
    }

    loadFromDiagram(diagram) {
        // ATTENTION JSON PARSE PROCESS HERE
        let diagramobject
        try
        {
            diagramobject = JSON.parse(diagram)
        }
        catch (e)
        {
            diagramobject = diagram
        }
        if (diagramobject) {
            let model2 = new DiagramModel();
            model2.deSerializeDiagram(diagramobject, this.app.getDiagramEngine());

            this.app.newModel(model2);
        }

    }

    render() {
        const styles = { border: '1px solid black', width: 200, color: 'black', padding: 20 };
        const flow = this.props.flow
        if (flow.data) {
            return (
                <div style={{height: "400px"}}>
                    <div
                        className="diagram-layer"
                        style={{height: 100}}
                        onDrop={this.handleDrop}

                        onDragOver={event => {
                            event.preventDefault();
                        }}
                    >
                        <DiagramWidget className="srd-demo-canvas" diagramEngine={this.app.getDiagramEngine()}/>
                        {flow.data.name && "This is " + flow.data.name}
                        <p>
                            <small> Please use this widget to draw out your required flow and save it for further
                                samples in your experiment
                            </small>
                        </p>
                        <Button outline color={"light"} size={"sm"} onClick={() => this.saveDiagram()}
                                className={"mx-auto"}>Lock</Button>

                    </div>
                </div>
            );
        }
        else {
            return ""
        }
    }
}
