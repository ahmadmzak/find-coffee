import React, { Component } from "react";
//import { BrowserRouter as Router, Route } from "react-router-dom";
import Search from "./Search";
import Result from "./Result";
import Map from "./Map";
import "./App.css";
import "./bg.jpg";

class App extends Component {
  state = {
    latlng: null,
    location: "",
    dragged: false,
    search: false,
    results: []
  };

  componentDidMount() {
    this.getLocation();
  }

  async latLngToLoc(latlng) {
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
      latlng.lat
    },
    ${latlng.lng}&key=AIzaSyD_onVU5ZwEAELU89hcWVU8YLfgR1wbZdk`;
    try {
      const response = await fetch(URL);
      const address = await response.json();
      const location = await address.results[0].address_components[2].long_name;
      return location;
    } catch (err) {
      console.error("Fetch failed ", err);
      return null;
    }
  }

  async locToLatLng(loc) {
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=AIzaSyD_onVU5ZwEAELU89hcWVU8YLfgR1wbZdk`;
    try {
      const response = await fetch(URL);
      const location = await response.json();
      const latlng = await location.results[0].geometry.location;
      return latlng;
    } catch (err) {
      console.error("Fetch failed ", err);
      return null;
    }
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async pos => {
          const latlng = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          const location = await this.latLngToLoc(latlng);
          this.setState({ latlng, location });
        },
        () => {
          console.error("Error getting geolocation");
        },
        {
          maximumAge: 600000
        }
      );
    } else {
      console.error("Could not get geolocation");
    }
  }

  handleInputChange = location => {
    this.setState({ location, dragged: false });
  };

  handleSearch = async () => {
    let latlng;
    let location = this.state.location;
    if (this.state.dragged) {
      latlng = this.state.latlng;
      location = await this.latLngToLoc(latlng);
    } else {
      latlng = await this.locToLatLng(this.state.location);
    }
    this.setState({ latlng, location, dragged: false, search: true });
    if (this.map && window.google) {
      this.map.getResults(latlng);
    }
  };

  handleNewLatLng = latlng => {
    this.setState({ latlng, dragged: true, location: "" });
  };

  handleNewResults = results => {
    this.setState({ results });
  };

  render() {
    const SearchBar = (
      <Search
        search={this.state.search}
        location={this.state.location}
        onSearch={this.handleSearch}
        onInputChange={this.handleInputChange}
      />
    );
    return (
      <div className="app">
        {this.state.search ? (
          <div className="top-bar">
            <h1 className="brand">FIND COFFEE</h1>
            {SearchBar}
          </div>
        ) : (
          <div className="bg">
            <div className="main">
              <h1>FIND COFFEE</h1>
              {SearchBar}
            </div>
          </div>
        )}
        {this.state.search ? (
          <div className="container">
            <ul className="results">
              {this.state.results.map((res, idx) => (
                <Result result={res} idx={idx} key={res.place_id} />
              ))}
            </ul>
            <div className="map">
              <Map
                latlng={this.state.latlng}
                onRef={ref => (this.map = ref)}
                onNewLatLng={this.handleNewLatLng}
                onNewResults={this.handleNewResults}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default App;
