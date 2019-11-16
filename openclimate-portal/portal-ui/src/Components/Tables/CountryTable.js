import React, { Component } from 'react'
import { Container, Header, List } from "semantic-ui-react";

import { Dropdown } from 'semantic-ui-react'


class CountryTable extends Component {

    constructor(props) {
        super(props)


        this.getCountries();

        this.handleChange = this.handleChange.bind(this);



    }



    componentDidUpdate(prevProps, prevState, snapshot) {

    }



    state = {
        countries: [],
        show_detail: [],
        selected_country_name: [],
        selected_value: []
    }





    initCountries(countries_data) {

        let newCountryOptions = []
        let index = 0;
       // console.log('DATA IN INIT: '+JSON.stringify(countries_data));
        countries_data.map(country => {

            let indexKey = 'key'+index
            let indexValue = 'value'+index
            let countryOption = {"key": indexKey, "value": country.cld_rdisplayname, "text": country.cld_rdisplayname};

            newCountryOptions[index] = countryOption;
            index++;

        })

        let countries = newCountryOptions;

        this.setState({countries});


    }

    componentDidMount() {



    }




    getCountries(){
        console.log('Get countries');
        fetch('http://localhost:3000/countries')
            .then(response => response.json())
            .then(countries => this.initCountries(countries))
            .catch(err => console.log(err))
    }


    handleChange (e, { value }) {




        var selected_country_name = {selected_country_name:value};
        this.setState(selected_country_name);

        console.log('New country name: '+value);

        this.props.func(value);



    }



  render() {

      const { value } = this.state;



      return (
        <Dropdown
            clearable
            fluid
            search
            selection
            options={this.state.countries}
            onChange={this.handleChange}
            value={value}
            placeholder='Select Country'
        />

      )


  }

}

export default CountryTable
