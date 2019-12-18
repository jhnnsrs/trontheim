import React, {Component} from "react";
import type {AnswerStavanger} from "../stavanger";
import {Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import OsloLink from "../../generics/OsloLink";

class ProfilesList extends Component {

    render() {
        const {profiles, } = this.props;
        if (profiles) {
            return (
                <React.Fragment>
                {profiles.map((profile, index) =>
                        <Card className="mt-2 overflow-auto" key={profile.data.id}>
                            <CardBody>
                                <CardTitle>{profile.data.name}</CardTitle>
                                <CardSubtitle>Profile {profile.data.id}</CardSubtitle>
                                <OsloLink size="sm" to={"/profiles/" + profile.data.id + "/html"}>Open</OsloLink>
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
    profiles: stavanger.profiles.selectors.getList,
});

const mapStavangerToDispatch  = (stavanger: AnswerStavanger) =>  ({
    visualize: (item) => stavanger.page.model.dynamic("VISUALIZE").request(item),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ProfilesList);
