import React, { Component } from 'react'

import CountryContext, {selectedCountry} from "../../Contexts/CountryContext";

import {Jumbotron, Card, CardTitle, CardText} from 'reactstrap';



class CountryDetail extends Component {

    constructor(props) {
        super(props)


    }


    state = {
        render: [],
        passed_country_name: [],
        country_emmissions_pledges: [],
        selected_country: []
    }


    getEmissionsPledgesForCountry(selected_country) {
        console.log('Selected: '+selected_country);
        if (selected_country) {
            fetch('http://localhost:3000/getEmissionsPledgesForCountry?countryName=' + selected_country)
                .then(response => response.json())
                .then(country_emissions_pledges => this.updateState({country_emissions_pledges}))
                .catch(err => console.log(err))
        }
    }

    updateState(country_emissions_pledges) {

        console.log('huh: '+JSON.stringify(country_emissions_pledges));

            if ((country_emissions_pledges.country_emissions_pledges['dataExists'] != 'false') && (country_emissions_pledges.country_emissions_pledges['dbError'] != 'db error')) {

                document.getElementById("latest_reported_amount").innerText = country_emissions_pledges.country_emissions_pledges[0].total_emissions;

            } else {
                document.getElementById("latest_reported_amount").innerText = '';

            }


    }




    componentDidMount(){
        this.getEmissionsPledgesForCountry();


    }

    render() {

        return (

                <CountryContext.Consumer>
                    {

                        (selectedCountry) => (

                            <div>

                                <Jumbotron>
                                    <h4 className="display-5">{this.getEmissionsPledgesForCountry(selectedCountry)}{selectedCountry}</h4>
                                    <Card body>
                                        <img id="company_detail_background" src="../../../../country_detail_background.png"/>

                                        <div id="latest_reported_amount"></div>

                                        <div id="latest_reported_pledges"></div>


                                    </Card>


                                </Jumbotron>
                            </div>
                        )
                    }
                </CountryContext.Consumer>
            )


    }
}

export default CountryDetail;
