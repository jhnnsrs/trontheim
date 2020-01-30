import React, {Component} from "react";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {UserSelectorStavanger} from "./index";
import * as _ from "lodash";

class UserList extends Component {

    render() {
        const {list} = this.props;
        if (list.data[0]) {
            return (
                <React.Fragment>
                    {list.data.map((user, index) =>
                        <Card className="mt-2" key={_.uniqueId()}>
                            <CardBody>
                                <CardTitle>{user.data.username}</CardTitle>
                                <CardSubtitle>User {user.data.id}</CardSubtitle>
                                <ButtonGroup>
                                    <Button className="mt-2" outline
                                            onClick={() => this.props.selectItem(user)}>Select</Button>
                                </ButtonGroup>
                            </CardBody>

                        </Card>)}
                </React.Fragment>
            );
        } else {
            return (<Card className="mt-2" key={_.uniqueId()}>
                <CardBody>
                    <CardTitle>No User</CardTitle>
                    <CardSubtitle>Module has not yet received all its Filters</CardSubtitle>
                </CardBody>

            </Card>)

        }
    }
}

const mapStavangerToProps = (stavanger: UserSelectorStavanger) => ({
    list: stavanger.creators.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: UserSelectorStavanger) =>  ({
    selectItem: (item) => stavanger.creators.model.selectItem.request(item),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(UserList);
