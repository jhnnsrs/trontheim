import {AbstractNodeFactory, DefaultNodeWidget} from "storm-react-diagrams";
import * as constants from "../../constants"
import {NodeSpawnModel} from "./NodeModels";
import React from "react"

export class ClassicNodeFactory extends AbstractNodeFactory {
    constructor() {
        super(constants.NODETYPES.CLASSIC);
    }

    generateReactWidget(diagramEngine, node) {
        return React.createElement(DefaultNodeWidget, {
            node: node,
            diagramEngine: diagramEngine
        });
    }

    getNewInstance(initialConfig) {
        console.log("called")
        return new NodeSpawnModel();
    }
}

