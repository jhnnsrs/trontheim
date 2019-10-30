import * as SRD from "storm-react-diagrams";
import {DefaultNodeFactory} from "storm-react-diagrams";
import * as _ from "lodash"
import {NodeSpawnModel} from "./NodeModels";
import {ClassicNodeFactory} from "./FilterNodeFactory";

export default class DiagramApp {
    activeModel: SRD.DiagramModel;
    diagramEngine: SRD.DiagramEngine;

    constructor(callback) {
        this.diagramEngine = new SRD.DiagramEngine();
        this.diagramEngine.installDefaultFactories();

        this.diagramEngine.registerNodeFactory(new DefaultNodeFactory());
        this.diagramEngine.registerNodeFactory(new ClassicNodeFactory());
        this.callback = callback
        this.newModel(new SRD.DiagramModel());
        this.serialize = this.serialize.bind(this);
    }

    serialize(event) {

        const nodes = this.getActiveDiagram().serializeDiagram().nodes;
        const links = this.getActiveDiagram().serializeDiagram().links;

        return {nodes, links}
    }

    onModelChangeDo(func) {
        this.callback = func
    }

    newModel(model) {
        this.activeModel = model;
        this.diagramEngine.setDiagramModel(this.activeModel);
        this.activeModel.addListener({nodesUpdated: () => this.callback(this.getActiveDiagram().serializeDiagram()),
            linksUpdated: () => this.callback(this.getActiveDiagram().serializeDiagram())}
        );

    }

    getActiveDiagram(): SRD.DiagramModel {
        return this.activeModel;
    }

    getDiagramEngine(): SRD.DiagramEngine {
        return this.diagramEngine;
    }
}