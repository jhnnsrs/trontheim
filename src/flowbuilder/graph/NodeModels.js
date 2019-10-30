import * as _ from "lodash";
import {DefaultPortModel, NodeModel} from "storm-react-diagrams";
import * as constants from "../../constants"
import v4 from 'uuid'
import {randomColor} from "randomcolor";

export type JSONString = string

export type Node = {
    data: {
        name: string,
        type: string,
        nodeclass: string,
        path: string,
        channel: string,
        inputmodel: JSONString,
        outputmodel: JSONString,
        defaultsettings: JSONString
    },
    meta: any
}

export class NodeSpawnModel extends NodeModel {
    entity = constants.UNKNOWN;
    name  = "Untitled";
    colorscheme = {luminosity: 'bright', format: 'rgb'};
    path = "Container"
    filterid ;
    ports;

    constructor(type, node: Node) {
        super(type);
        if (node) {
            if (node.data) this.init(node.data)
        }
    }

    init(data) {
            this.nodeid = data.id;
            this.name = data.name ? data.name : this.name;
            this.color = data.color ? data.color : randomColor(this.color);
            this.entityid = data.entityid ? data.entityid : this.entityid;
            this.variety = data.variety ? data.variety : this.entity;
            this.path = data.path ? data.path : this.path;
            this.inputmodel = data.inputmodel ? JSON.parse(data.inputmodel): this.getInputModel();
            this.outputmodel = data.outputmodel ? JSON.parse(data.outputmodel): this.getOutputModel();
            this.defaultsettings = data.defaultsettings ? JSON.parse(data.defaultsettings): null;
            this.baseid = data.id

            for (let i in this.inputmodel) {
                this.addInPort(this.inputmodel[i])
            }

            for (let i in this.outputmodel) {
                this.addOutPort(this.outputmodel[i])
            }
        }

    addInPort(model) {
        return this.addPort(new DefaultPortModel(true, _.uniqueId("port-"), model, model.toUpperCase() + "_IN" + this.nodeid));
    }

    addOutPort(model) {
        return this.addPort(new DefaultPortModel(false, _.uniqueId("port-"), model, model.toUpperCase() + "_OUT" + this.nodeid));
    }

    getInputModel() {
        return []
    }

    getOutputModel() {
        return []
    }

    deSerialize(object, engine) {
        super.deSerialize(object, engine);
        this.nodeid = object.nodeid
        this.name = object.name;
        this.color = object.color;
        this.entityid = object.entityid;
        this.path = object.path;
        this.variety = object.variety;
        this.defaultsettings = object.defaultsettings;
        this.baseid = object.baseid
    }

    serialize() {
        return _.merge(super.serialize(), {
            name: this.name,
            color: this.color,
            entityid: this.entityid,
            nodeid: this.nodeid,
            path: this.path,
            variety: this.variety,
            defaultsettings: this.defaultsettings,
            baseid: this.baseid,
        });
    }

    getInPorts() {
        return _.filter(this.ports, portModel => {
            return portModel.in;
        });
    }

    getOutPorts() {
        return _.filter(this.ports, portModel => {
            return !portModel.in;
        });
    }
}



