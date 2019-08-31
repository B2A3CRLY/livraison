import React, { Component } from 'react'
import Select from 'react-select'
import http from '../../services/httpService';
import {
  apiUrl
} from '../../config.json';
const apiEndpoint = apiUrl + '/article';
export default class SelectProduct extends Component {
    state = {
      selectedOption: null,
      products: []
  };
  async componentDidMount() {
    const { data: products } = await http.get(apiEndpoint);
    this.setState({products})
    console.log("Data ",products)

  }
  handleChange = selectedOption => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
      };
      render() {
        const { selectedOption, products } = this.state;
     
        return (
          <Select
            getOptionLabel={option =>`${option.designation}`}
            value={selectedOption}
            onChange={this.handleChange}
            options={products}
          />
        );
      }
}
