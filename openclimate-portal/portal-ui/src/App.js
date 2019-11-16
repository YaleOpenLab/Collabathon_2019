import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import ModalForm from './Components/Modals/Modal'
import CountryTable from './Components/Tables/CountryTable'
import PortalHome from './Components/Home/PortalHome';
//import { CSVLink } from "react-csv"

class App extends Component {




  render() {
    return (
      <Container className="App">
        <PortalHome />
      </Container>
    )
  }
}

export default App
