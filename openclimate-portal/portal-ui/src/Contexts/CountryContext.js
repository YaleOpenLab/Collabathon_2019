import React from 'react';
export const selectedCountry = {
    countryName: ""
};
const CountryContext = React.createContext(selectedCountry.countryName);
export default CountryContext;
