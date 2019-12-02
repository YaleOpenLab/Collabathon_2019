import React, { Component, useState} from 'react'
import CountryTable from '../Tables/CountryTable'
import SearchInput from '../Forms/SearchInput'

import { Button, Navbar, Nav,  Row, Col, TabContent, TabPane, NavLink, Collapse, Dropdown, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, NavbarToggler, NavItem, NavDropdown, Form, NavbarBrand} from 'reactstrap';

import classnames from 'classnames';

import CountryDetail from "../Countries/CountryDetail";


import CountryContext from "../../Contexts/CountryContext";



class PortalHome extends Component {

    constructor(props) {
        super(props)


        this.setSelectedCountry = this.setSelectedCountry.bind(this)

    }

    state = {
        status: [],
        render_country_detail: [1],
        selected_country_name: [],
        passed_country_name: []
    }

    activeTab = '2';

    setActiveTab(tabNum) {
        this.activeTab = tabNum;
    }


    toggle = tab => {
        if(this.activeTab !== tab) this.setActiveTab(tab);
        this.setState({});
    }

    setSelectedCountry(country_name) {

        this.setState({selected_country_name:country_name});
        this.setState({selectedCountry:country_name});


    }

        componentDidMount(){


        }



    render() {
        return (

            <CountryContext.Provider value={this.state.selected_country_name}>

            <div class="float-left">
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/"><h2>Open Climate Accounting Portal</h2></NavbarBrand>
                    <NavbarToggler />
                    <Collapse isOpen={true} navbar>
                        <Nav className="ml-auto" navbar>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Portal Mode (Explore)
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        Explore
                                    </DropdownItem>
                                    <DropdownItem>
                                        Account
                                    </DropdownItem>
                                    <DropdownItem>
                                        Trade
                                    </DropdownItem>
                                    <DropdownItem>
                                        Learn
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem>
                                        Develop
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                   Account (Logged In)
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        Manage
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem>
                                        Logout
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Navbar>
                <Row>
                    <Col>
                        <h1 style={{margin: "20px 0"}}>Earth</h1>
                    </Col>
                    <Col>
                        <SearchInput/>
                    </Col>
                </Row>

                    <Nav tabs>
                        <NavItem>
                            <NavLink className={classnames({ active: this.activeTab === '1' })}
                                     onClick={() => { this.toggle('1'); }}>
                                Earth
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={classnames({ active: this.activeTab === '2' })}
                                onClick={() => { this.toggle('2'); }}>
                                Countries
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.activeTab === '3' })}
                                onClick={() => { this.toggle('3'); }}>
                                Cities
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.activeTab === '4' })}
                                onClick={() => { this.toggle('4'); }}>
                                Communities
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.activeTab === '5' })}
                                onClick={() => { this.toggle('5'); }}>
                                Companies
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.activeTab === '6' })}
                                onClick={() => { this.toggle('6'); }}>
                                Collaborators
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.activeTab}>
                        <TabPane tabId="1">
                            <Row>
                                <Col sm="12">

                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">

                        </TabPane>
                    </TabContent>

                <Row>
                <Col>

                    <CountryTable func={this.setSelectedCountry} />


                        { this.state.render_country_detail == 1 && <CountryDetail passed_country_name = 'United States'/>}



                </Col>
                </Row>
                <Row>
                <Col>
                </Col>
                </Row>
        </div>
            </CountryContext.Provider>

        )
}
}

export default PortalHome;


