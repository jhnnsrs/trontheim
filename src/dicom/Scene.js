import React, { Component } from 'react'
import * as THREE from 'three'
import CamerasOrthographic from './src/cameras/cameras.orthographic'
import { TrackballOrthoControl} from "./src/controls/controls";
import HelpersStack from './src/helpers/helpers.stack';
import LoadersVolume from './src/loaders/loaders.volume';
import HelpersLut from './src/helpers/helpers.lut';
import {Button, Container} from "reactstrap";


class Scene extends Component {
    constructor(props) {
        super(props);

        this.representationid = null

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
            }
        }
        if (e.deltaY > 0) {
            if (this.stackHelper) {
                if (this.stackHelper.index <= 0) {
                    return false;
                }
                this.stackHelper.index -= 1;
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


        let ControlConstruction = TrackballOrthoControl(THREE);
        const controls = new ControlConstruction(camera, this.mount);
        controls.staticMoving = true;
        controls.enabled = true;
        this.controls = controls
        this.camera.controls = this.controls;
    }


    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        this.representationid = this.props.repid;

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

        // set camera
        let worldbb = this.stack.worldBoundingBox();
        let lpsDims = new THREE.Vector3(
            (worldbb[1] - worldbb[0])/2,
            (worldbb[3] - worldbb[2])/2,
            (worldbb[5] - worldbb[4])/2
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

        this.camera.directions = [ this.stack.xCosine,  this.stack.yCosine,  this.stack.zCosine];
        this.camera.box = box;
        this.camera.canvas = canvas;
        this.camera.update();
        this.camera.fitBox(2);

    }

    loadFiles() {


        this.loader = new LoadersVolume(this.mount);
        let files = ["http://localhost:8000/api/data/" + this.representationid + "/asnifti/"];
        this.loader.load(files[0])
            .then(this.load);
    }


    load() {
                    // make a proper function for this guy...
        console.log(this.loader)

        let series = this.loader.data[0].mergeSeries(this.loader.data)[0];
        let stack = series.stack[0];

        let HelperConstructor = HelpersStack(THREE);
        this.stackHelper = new HelperConstructor(stack);

        this.stackHelper.bbox.color = 0xF9F9F9;
        this.stackHelper.border.color = 0xF9F9F9;
        this.scene.add(this.stackHelper);

                    // update camrea's and control's target
        let centerLPS = this.stackHelper.stack.worldCenter();
        this.camera.lookAt(centerLPS, centerLPS.y, centerLPS.z);
        this.camera.updateProjectionMatrix();
        this.controls.target.set(centerLPS.x, centerLPS.y, centerLPS.z);

        this.loader.free();
        this.loader = null;
        this.renderScene()
                }



    render() {
        return (
            <Container className="text-center">
                <Button outline onClick={this.loadFiles} style={{margin: 5}}>Load File</Button>
                <div className="align-content-center"
                    style={{ width: '1000px', height: '1000px', margin: "0 auto" }}
                    ref={(mount) => { this.mount = mount }}
                />
            </Container>
        )
    }
}

export default Scene