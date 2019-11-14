import React, {Component} from "react";
import CamerasOrthographic from "../../dicom/src/cameras/cameras.orthographic";
import * as THREE from "three";
import {TrackballOrthoControl} from "../../dicom/src/controls/controls";
import HelpersStack from "../../dicom/src/helpers/helpers.stack";
import LoadersVolume from "../../dicom/src/loaders/loaders.volume";

import {connectInstrument} from "../../alta/react";
import type {ExhibitShowStavanger} from "./index";

class NiftiCube extends Component {
    constructor(props) {
        super(props);

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.animate = this.animate.bind(this);
        this.loadFiles = this.loadFiles.bind(this);
        this.load = this.load.bind(this);
        this.changeZ = this.changeZ.bind(this)
    }

    changeZ(e) {
        if (e.deltaY < 0) {
            if (this.stackHelper) {
                if (this.stackHelper.index >= this.stackHelper.orientationMaxIndex - 1) {
                    return false;
                }
                this.stackHelper.index += 1;
                this.props.zValueChanged(this.stackHelper.index)
            }
        }
        if (e.deltaY > 0) {
            if (this.stackHelper) {
                if (this.stackHelper.index <= 0) {
                    return false;
                }
                this.stackHelper.index -= 1;
                this.props.zValueChanged(this.stackHelper.index)
            }
        }
    }



    setOverheadCamera() {

        let Construction = CamerasOrthographic(THREE);
        const camera = new Construction(
            this.mount.clientWidth / -2,  this.mount.clientWidth / 2,
            this.mount.clientHeight / 2,  this.mount.clientHeight / -2,
            0.1, 10000);

        this.camera = camera;
        // controls

        let ControlConstruction = TrackballOrthoControl(THREE);
        const controls = new ControlConstruction(camera, this.mount);
        controls.staticMoving = true;
        controls.noRotate = true;
        this.controls = controls
        this.camera.controls = this.controls;

    }

    setZoomingCamera() {

        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        let Construction = CamerasOrthographic(THREE);
        const camera = new Construction(
            width / -2, width / 2,
            height/ 2, height / -2,
            0.1, 10000);

        camera.position.x = width / 2;
        camera.position.y = width / 2;
        camera.position.z = width / 2;

        this.camera = camera
        this.camera.orientation = "coronal"


        let ControlConstruction = TrackballOrthoControl(THREE);
        const controls = new ControlConstruction(camera, this.mount);
        controls.staticMoving = true;
        controls.enabled = true;
        controls.noRotate = true;
        this.controls = controls
        this.camera.controls = this.controls;
    }


    componentDidMount() {
        const width = this.mount.clientWidth -10 ;
        const height = width;

        this.mount.addEventListener("wheel", this.changeZ, true);

        const scene = new THREE.Scene();

        const renderer = new THREE.WebGLRenderer({ antialias: true});

        this.renderer = renderer;

        this.mount.appendChild(this.renderer.domElement);


        this.setZoomingCamera()


        renderer.setSize(width, height);
        renderer.setClearColor( 0xD3D3D3, 1);
        renderer.setPixelRatio(window.devicePixelRatio);



        this.scene = scene;


        var light = new THREE.HemisphereLight( 0xffffff, 0xeeeeee, 0.75 );
        light.position.set( 0.5, 1, 0.75 );
        this.scene.add( light );


        this.stackHelper = false;
        this.start()
        if (this.props.exhibit.data) this.loadFiles(this.props.exhibit)
    }

    componentDidUpdate(prevProps) {
        console.log("CALLED")
        if (this.props.exhibit.data){
            if (this.props.exhibit.data !== prevProps.exhibit.data) this.loadFiles(this.props.exhibit)
        }
    }

    componentWillUnmount() {
        this.stop();
        this.mount.removeChild(this.renderer.domElement)
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop() {
        cancelAnimationFrame(this.frameId)
    }

    animate() {
        this.renderScene();
        this.frameId = window.requestAnimationFrame(this.animate)
    }



    renderScene() {
        if ( this.stackHelper) {
            //this.stackHelper.index += 1;
            if ( this.stackHelper.outOfBounds === true) {
                //this.stackHelper.orientation = ( this.stackHelper.orientation + 1) % 3;
                this.stackHelper.index = 0;
            }
        }

        this.controls.update();

        this.renderer.render(this.scene, this.camera)
    }

    handleSeries(seriesContainer) {
        // cleanup the loader and its progress bar
        this.loader.free();
        this.loader = null;
        // prepare for slice visualization
        // first stack of first series
        this.stack = seriesContainer[0].mergeSeries(seriesContainer)[0].stack[0];

        this.stackHelper = new HelpersStack(this.stack);
        this.stackHelper.bbox.visible = false;
        this.stackHelper.borderColor = '#2196F3';
        this.stackHelper.border.visible = false;
        this.scene.add(this.stackHelper);

        this.camera.orientation = "sagittal";
        this.stackHelper.orientation = this.camera.stackOrientation;
        // set camera
        let worldbb = this.stack.worldBoundingBox();
        let lpsDims = new THREE.Vector3(
            (worldbb[1] - worldbb[0]),
            (worldbb[3] - worldbb[2]),
            (worldbb[5] - worldbb[4])
        );

        // box: {halfDimensions, center}
        let box = {
            center: this.stack.worldCenter().clone(),
            halfDimensions:
                new THREE.Vector3(lpsDims.x + 10, lpsDims.y + 10, lpsDims.z + 10),
        };

        // init and zoom
        let canvas = {
            width:  this.mount.clientWidth,
            height: this.mount.clientHeight,
        };

        this.camera.directions = [this.stack.zCosine, this.stack.yCosine, this.stack.xCosine];
        this.camera.box = box;
        this.camera.canvas = canvas;
        this.camera.update();
        this.camera.fitBox(2);

    }

    loadFiles(exhibit) {
        let shape = [1024,1024,3]
        let filenames = null
        if (exhibit.data) {
            if (exhibit.data.shape) {
                shape = JSON.parse(exhibit.data.shape);
                //parent.height = parent.width * (shape[0]/shape[1]);
            }
            else {
                //parent.height = parent.width; // TODO: is this really correct?
            }
        }
        console.log("Incoming Exhibit",exhibit)
        if (exhibit.data) {
            if (exhibit.data.niftipath) {
                // TODO: Should get the path
                console.log(exhibit.data.niftipath)

                filenames = [exhibit.data.niftipath];

                this.loader = new LoadersVolume(this.mount);
                this.loader.load(filenames[0])
                    .then(this.load);
            }
        }


    }


    load() {
        // make a proper function for this guy...
        console.log(this.loader)

        try {
            let series = this.loader.data[0].mergeSeries(this.loader.data)[0];
            this.stack = series.stack[0];

            let HelperConstructor = HelpersStack(THREE);
            this.stackHelper = new HelperConstructor(this.stack);

            this.stackHelper.bbox.color = 0xF9F9F9;
            this.stackHelper.border.color = 0xF9F9F9;
            this.scene.add(this.stackHelper);

            // set camera
            let worldbb = this.stack.worldBoundingBox();
            let lpsDims = new THREE.Vector3(
                (worldbb[1] - worldbb[0]),
                (worldbb[3] - worldbb[2]),
                (worldbb[5] - worldbb[4])
            );

            let box = {
                center: this.stack.worldCenter().clone(),
                halfDimensions:
                    new THREE.Vector3(lpsDims.x + 10, lpsDims.y + 10, lpsDims.z + 10),
            };

            // init and zoom
            let canvas = {
                width:  this.mount.clientWidth,
                height: this.mount.clientHeight,
            };

            // update camrea's and control's target
            this.camera.directions = [this.stack.xCosine, this.stack.yCosine, this.stack.zCosine];
            this.camera.box = box;
            this.camera.canvas = canvas;
            this.camera.update();
            this.camera.fitBox(2);

            this.loader.free();
            this.loader = null;
            this.renderScene()
        }
        catch (e) {
            console.log(e)
        }
    }



    render() {
        return (
                <div style={{width: this.props.width, height: this.props.height}}
                     ref={(mount) => {
                         this.mount = mount
                     }}
                />
        )
    }
}

const mapStavangerToProps = (stavanger: ExhibitShowStavanger) => ({
    exhibit: stavanger.exhibit.selectors.getModel
});

const mapStavangerToDispatch  = (stavanger: ExhibitShowStavanger) =>  ({
    zValueChanged: (value) =>  stavanger.cube.model.setZValue.request(value)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NiftiCube);
