import React, {Component} from "react";
import type {AnswersStavanger} from "../stavanger";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";
import OsloLink from "../../generics/OsloLink";

class AnswersList extends Component {

    render() {
        const { answers, profiles, visualizers} = this.props;
        if (answers.data) {
            return (
                <React.Fragment>
                {answers.data.map((answer, index) =>
                        <Card className="mt-2 overflow-auto" key={answer.data.id}>
                            <CardBody>
                                <CardTitle>{answer.data.name}</CardTitle>
                                <CardSubtitle>Answer {answer.data.id}</CardSubtitle>
                                <ButtonGroup>
                                    <ButtonToNavigate size="sm" to={"/answer/" + answer.data.id}>Open</ButtonToNavigate>
                                    {visualizers.map( item =>
                                        <Button onClick={() => this.props.visualize({answer: answer, visualizer: item})}>Visualize with {item.data.name}</Button>
                                    )}
                                </ButtonGroup><br/>
                                Answers<br/>
                                <ButtonGroup>
                                    {profiles.filter(item => item.data.answer == answer.data.id).map( item =>
                                        <OsloLink size="sm" to={"/profiles/" + item.data.id + "/html"}>Open</OsloLink>
                                    )}
                                </ButtonGroup>
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

const mapStavangerToProps = (stavanger: AnswersStavanger) => ({
    answers: stavanger.answers.selectors.getModel,
    profiles: stavanger.profiles.selectors.getList,
    visualizers: stavanger.visualizers.selectors.getList
});

const mapStavangerToDispatch  = (stavanger: AnswersStavanger) =>  ({
    visualize: (item) => stavanger.page.model.dynamic("VISUALIZE").request(item),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(AnswersList);
