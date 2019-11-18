import React, {Component} from "react";
import {Card, CardBody, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {HomeStavanger} from "../stavanger";
import OsloLink from "../../generics/OsloLink";

class QuickLinksCard extends Component {


    render() {
        return (
            <Card inverse className="mt-2 bg-dark">
                <CardBody>
                    <CardTitle>Questions</CardTitle>
                    <CardText>
                        <small>For information on how to use questions refer to the manual</small>
                    </CardText>
                    {}
                    <CardText>
                        <OsloLink  base="true" size="sm" outline="true" color="light" to={"/graphql"}>Open Question Playground</OsloLink>
                    </CardText>
                </CardBody>
            </Card>
            )
    }
}

const mapStavangerToProps = (stavanger: HomeStavanger) => ({

});

const mapStavangerToDispatch  = (stavanger: HomeStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(QuickLinksCard);
