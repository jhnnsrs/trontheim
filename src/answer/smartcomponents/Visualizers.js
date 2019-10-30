import React, {Component} from "react";
import type {AnswerStavanger} from "../stavanger";
import {Button, Card, CardBody, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class Flows extends Component {

    render() {
        const {visualizers, answer, visualizings} = this.props;
        if (visualizers && answer) {
            return (
                <React.Fragment>
                {visualizers.map(visualizer =>
                        <Card className="mt-2" key={visualizer.data.id}>
                            <CardBody>
                                <CardTitle>{visualizer.data.name}</CardTitle>
                                <Button onClick={() => this.props.visualize({answer: answer, visualizer: visualizer})}>Visualize with {visualizer.data.name}</Button>
                                {visualizings.filter(item => item.data.visualizer == visualizer.data.id && item.data.status != "DONE").map(
                                    item => {
                                        if (item.data.status == "DONE") return <p>Done</p>
                                        if (item.data.status == "WORKING") return <p>Working</p>
                                        if (item.data.status == "ERROR") return <p>Error!!</p>
                                        else return  <p color="danger">Error: {item.data.status}</p>
                                    }
                                )}
                            </CardBody>

                        </Card>)}
                </React.Fragment>
            );
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: AnswerStavanger) => ({
    visualizers: stavanger.visualizers.selectors.getList,
    visualizings: stavanger.visualizings.selectors.getList,
    answer: stavanger.answer.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: AnswerStavanger) =>  ({
    visualize: (item) => stavanger.page.model.dynamic("VISUALIZE").request(item),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Flows);
