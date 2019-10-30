
import {Button} from "reactstrap";
import React from "react";
import type {HeaderStavanger} from "../stavanger";
import {connectInstrument} from "../../alta/react";
import type {RootStavanger} from "../../rootStavanger";
import OAuthEndpointChoserModal from "./OAuthEndpointChoserModal";
import ProfileNav from "./ProfileNav";

class LoginMenu extends React.Component {

        render() {
        let {hasUser, openModal} = this.props;
        if (hasUser) {
            return <ProfileNav/>
        } else {
            return <p align="center">
                <OAuthEndpointChoserModal/>
                <Button outline color="success" onClick={() => openModal()}>Login</Button></p>
        }
    }
}

const mapStavangerToProps = (stavanger: HeaderStavanger) => {
    let rootStavanger: RootStavanger = stavanger.parent // This is the portal we need to the Root

    return {
        hasUser: rootStavanger.user.selectors.hasUser,
    }
};

const mapStavangerToDispatch  = (stavanger: HeaderStavanger) =>  ({
    openModal: () => stavanger.page.model.setProp.request({key: "modalOpen", value: true})
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LoginMenu);
