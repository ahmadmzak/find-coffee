import React, { Component } from "react";
//import { Link } from "react-router-dom";

class Search extends Component {
  handleChange = e => {
    this.props.onInputChange(e.target.value);
  };
  handleClick = e => {
    e.preventDefault();
    this.props.onSearch();
  };
  /*render() {
    return (
      <div className="Search">
        <input
          type="text"
          placeholder={this.props.moved ? "Search here" : "Near..."}
          value={this.props.location}
          onChange={this.handleChange}
        />
        <Link to={this.props.location ? "/results" : "/"}>
          <button onClick={this.handleClick}>Search</button>
        </Link>
      </div>
    );
  }*/
  render() {
    return (
      <div className="Search">
        <input
          type="text"
          placeholder={this.props.search ? "Search Here" : "Coffee Near..."}
          value={this.props.location}
          onChange={this.handleChange}
        />
        <button onClick={this.handleClick}>Search</button>
      </div>
    );
  }
}

export default Search;
