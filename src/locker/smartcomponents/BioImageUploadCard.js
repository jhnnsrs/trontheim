import React from 'react';
import FileDrop from 'react-file-drop';
import {Card, CardText, CardTitle} from "reactstrap";
import type {LockerStavanger} from "../stavanger";
import {connectInstrument} from "../../alta/react";

class BioImageUploadCard extends React.Component {

    constructor(props){
        super(props)
    }

    handleDrop = (files, event) => {
        let {uploadBioImage} = this.props;
        console.log("Uploading Files");
        uploadBioImage(files)
    };



    render() {
        const styles = { border: '1px solid white', color: 'rgb(205,205,205)' , backgroundColor: "#333"};
        return (
            <Card body inverse className="mt-2"  style={{ backgroundColor: '#000000', borderColor: '#333' }}>
                <CardTitle>Upload Bioimage </CardTitle>
                    <Card id="react-file-drop-demo" style={styles} className="w-100 p-3 mt-1 mb-1">
                        <FileDrop onDrop={this.handleDrop}>
                            Drop some files here!
                        </FileDrop>
                    </Card>
                <CardText><small className="text-muted">Last updated 3 mins ago</small> </CardText>
            </Card>
        );
    }
}

const mapStavangerToProps = (stavanger: LockerStavanger) => ({
    locker: stavanger.locker.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: LockerStavanger) =>  ({
    uploadBioImage: (files) => stavanger.page.model.dynamic("UPLOAD").request(files)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(BioImageUploadCard);