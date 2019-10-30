import React, { Component } from 'react';
import {Collapse, Nav, Navbar, NavItem, NavLink} from "reactstrap";
import {Pencil, Plus} from "@githubprimer/octicons-react";
import Octicon from "@githubprimer/octicons-react";

class Footer extends Component {

	render () {
		let hide = true;
		return (
	    <footer>
			{ hide ? "":
              <Navbar color="faded" light expand="xs" className="d-flex justify-content-center" size={"sm"}>
					<Nav navbar>
						<NavItem>
							<NavLink>Johannes</NavLink>
						</NavItem>
				  		<NavItem>
							<NavLink href="#/"><Octicon icon={Pencil} ariaLabel="Add new item"/></NavLink>
                          </NavItem>
                        <NavItem>
                            <NavLink>Roos</NavLink>
                        </NavItem>
					</Nav>
			  </Navbar>
            }
	    </footer>
	  )
	}
}

export default Footer;