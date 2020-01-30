import React, {Component} from "react";
import type {QuestionsStavanger} from "../stavanger";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class QuestionList extends Component {

    render() {
        const { questions, answers, oracles} = this.props;
        if (questions.data) {
            return (
                <React.Fragment>
                {questions.data.map((question, index) =>
                        <Card className="mt-2 overflow-auto" key={question.data.id} >
                            <CardBody>
                                <CardTitle>{question.data.name}</CardTitle>
                                <CardSubtitle>Bioimage {question.data.id}</CardSubtitle>
                                <ButtonGroup>
                                    <ButtonToNavigate size="sm" to={"/question/" + question.data.id}>Open</ButtonToNavigate>
                                    {oracles.map( item =>
                                        <Button onClick={() => this.props.answer({question: question, oracle: item})}>Answer with {item.data.name}</Button>
                                    )}
                                    <Button onClick={() => this.props.deleteQuestion(question)} outline color="danger">Delete Question</Button>
                                </ButtonGroup><br/>
                                Answers<br/>
                                <ButtonGroup>
                                    {answers.filter(item => item.data.question == question.data.id).map( item =>
                                        <ButtonToNavigate size="sm" to={"/answer/" + item.data.id}>{item.data.name}</ButtonToNavigate>
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

const mapStavangerToProps = (stavanger: QuestionsStavanger) => ({
    questions: stavanger.questions.selectors.getModel,
    answers: stavanger.answers.selectors.getList,
    oracles: stavanger.oracles.selectors.getList
});

const mapStavangerToDispatch  = (stavanger: QuestionsStavanger) =>  ({
    deleteQuestion: (item) => stavanger.questions.model.deleteItem.request(item),
    answer: (item) => stavanger.page.model.dynamic("ANSWER").request(item),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(QuestionList);
