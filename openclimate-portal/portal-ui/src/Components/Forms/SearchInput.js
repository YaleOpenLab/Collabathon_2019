import React from "react";
import { MDBCol } from "mdbreact";
import {Button, Jumbotron} from "reactstrap";

const SearchPage = () => {
    return (
        <MDBCol md="6">
            <input id="search_input" className="form-control" type="text"  placeholder="Search All Earth Scope Climate Actors" aria-label="Search" />
            <div id="search_button">
                <Button>Search</Button>
            </div>
        </MDBCol>
    );
}

export default SearchPage;
