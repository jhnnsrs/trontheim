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

        this.setOrientationIndex = 0
        this.startAnimation = this.startAnimation.bind(this);
        this.stopAnimation = this.stopAnimation.bind(this);
        this.animate = this.animate.bind(this);
        this.loadFiles = this.loadFiles.bind(this);
        this.load = this.load.bind(this);
        this.changeZ = this.changeZ.bind(this)
        this.changeOrientation = this.changeOrientation.bind(this)
    }

    changeOrientation(e) {
        let orientation = [
            'default',
            'axial',
            'coronal',
            'sagittal',
        ]

        this.camera.orientation = orientation[this.setOrientationIndex]
        this.setOrientationIndex++
        if (this.setOrientationIndex === orientation.length) this.setOrientationIndex = 0

        this.camera.update()
        this.camera.fitBox(2)
        this.stackHelper.orientation = this.camera.stackOrientation

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

    setZoomingCamera() {

        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        let Construction = CamerasOrthographic(THREE);
        this.camera = new Construction(
            width / -2,
            width / 2,
            height/ 2,
            height / -2,
            0.1, 10000);


        let ControlConstruction = TrackballOrthoControl(THREE);
        this.controls = new ControlConstruction(this.camera, this.mount);
        this.controls.staticMoving = true;
        this.controls.noRotate = true;
        this.camera.controls = this.controls;
    }


    componentDidMount() {
        if (!this.mount) return
        this.width = this.mount.clientWidth -10 ;
        this.height = this.width;

        this.mount.addEventListener("wheel", this.changeZ, true);
        this.resizer = window.addEventListener("resize", this.componentDidMount, true)


        // Set Up Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true});
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor( 0xD3D3D3, 1);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.mount.appendChild(this.renderer.domElement);

        // Setup Scene
        this.scene = new THREE.Scene();

        this.setZoomingCamera()

        this.stackHelper = false;
        this.startAnimation()
        if (this.props.exhibit.data) this.loadFiles(this.props.exhibit)
    }

    componentDidUpdate(prevProps) {
        console.log("CALLED")
        if (this.props.exhibit.data){
            if (this.props.exhibit.data !== prevProps.exhibit.data) this.loadFiles(this.props.exhibit)
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.componentDidMount, true)
        this.stopAnimation();
        this.mount.removeChild(this.renderer.domElement)
    }

    startAnimation() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stopAnimation() {
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

    loadFiles(exhibit) {
        let filenames = null
        if (exhibit.data) {
            if (exhibit.data.shape) {
                let shape = JSON.parse(exhibit.data.shape);
                this.height = shape[0]/shape[1] * this.width
                this.renderer.setSize(this.width, this.height);
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

        try {
            this.series = this.loader.data[0].mergeSeries(this.loader.data)[0];
            this.stack = this.series.stack[0];
            this.loader.free()

            let HelperConstructor = HelpersStack(THREE);
            this.stackHelper = new HelperConstructor(this.stack);
            this.stackHelper.bbox.visible = false;
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
            //this.loader = null;
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
    exhibit: stavanger.exhibit.selectors.getModel,
    cube: stavanger.cube.selectors.getModel
});

const mapStavangerToDispatch  = (stavanger: ExhibitShowStavanger) =>  ({
    zValueChanged: (value) =>  stavanger.cube.model.setZValue.request(value)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NiftiCube);
