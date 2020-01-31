import React from "react";
import {Button, ButtonGroup, Card, CardColumns, CardTitle} from "reactstrap";
import * as _ from "lodash";
import {connectInstrument} from "../../alta/react";
import type {FlowBuilderStavanger} from "../stavanger";
import NodeDrag from "./NodeDrag";
import Slider from "react-slick";
import {VARIETYDESCRIPTION} from "../../constants";

class InList extends React.Component {

    state = {
        slideIndex: 0,
        updateCount: 0
    }

    componentDidMount(): void {
        this.setState({
            slideIndex: 0,
            updateCount: 0
        })
    }


    getDescription(type) {
        if (VARIETYDESCRIPTION[type]) {
            return VARIETYDESCRIPTION[type]
        }
        else return {name: _.capitalize(type), description: "dummy"}


    }

    render() {

        const {nodedict} = this.props
        if (!nodedict) return null

        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            afterChange: () =>
                this.setState(state => ({ updateCount: state.updateCount + 1 })),
            beforeChange: (current, next) => {if (next) this.setState({ slideIndex: next })}
        };
        return (
            <Card body style={{ backgroundColor: '#333', borderColor: '#FFFFFF' }} className={"mt-2"}>
                <ButtonGroup>
                    { Object.keys(nodedict).map( (value, key) =>
                        <Button key={key} onClick={() => this.slider.slickGoTo(key)} outline={this.state.slideIndex === key}>{this.getDescription(value).name}</Button>
                    )}
                </ButtonGroup>
                <Slider ref={slider => (this.slider = slider)} {...settings}>
                    { Object.entries(nodedict).map( ([type, elements]) =>
                        <div>
                        <Card body  style={{ backgroundColor: '#333', borderColor: '#FFFFFF' }} className={"mt-2"}>
                            <CardColumns>
                                {elements.map( node =>  <NodeDrag node={node}/>)}
                            </CardColumns>
                        </Card>
                        </div>
                    )}
                </Slider>
            </Card>
        );
    }
}

class List extends React.Component {

    render() {

        const {nodes} = this.props
        const nodedict = {}

        nodes.map( node => {
            if (nodedict[node.data.variety]){
                nodedict[node.data.variety].push(node)
            }
            else {
                nodedict[node.data.variety] = []
                nodedict[node.data.variety].push(node)
            }
        })


        return <InList nodedict={nodedict}/>
    }
}



const mapStavangerToProps = (stavanger: FlowBuilderStavanger) => ({
    nodes: stavanger.nodesList.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: FlowBuilderStavanger) =>  ({
    selectItem: (item) => stavanger.nodesList.model.selectItem.request(item),
    deleteItem: (item) => stavanger.nodesList.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(List);