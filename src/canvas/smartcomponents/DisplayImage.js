import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";
import {getRootUrl} from "../../alta/helpers";


class DisplayImage extends Component {

    getImageSrc(display) {
        if (display.data) {
            if (display.data.image) {
                // TODO: Should get the path
                return display.data.image
            }
            if (display.data.shape) {
                let shape = JSON.parse(display.data.shape)
                return "http://via.placeholder.com/" + shape[0] + "x" + shape[1]
            }
        }
        else return "http://via.placeholder.com/1024x1024"
    }

    render() {
        return <image href={this.getImageSrc(this.props.display)} x="0" y="0"
                      height={this.props.height}
                      width={this.props.width}/>;
    }
}

const mapStateToProps = state => {
    return {
        rooturl: getRootUrl(state)
    };
};

const mapDispatchToProps = {
};


export default connect(mapStateToProps, mapDispatchToProps)(DisplayImage);