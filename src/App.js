import React, { Component } from "react";
//import { BrowserRouter as Router, Route } from "react-router-dom";
import Search from "./Search";
import Result from "./Result";
import Map from "./Map";
import "./App.css";

class App extends Component {
  state = {
    latlng: null,
    dragLatLng: null,
    location: "",
    dragged: false,
    search: false
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
    let location = "";
    if (this.state.dragged) {
      latlng = this.state.dragLatLng;
      location = await this.latLngToLoc(latlng);
    } else {
      latlng = await this.locToLatLng(this.state.location);
    }
    this.setState({ latlng, location, dragged: false, search: true });
    if (this.map && window.google) this.map.getResults(latlng);
  };

  handleNewLatLng = latlng => {
    this.setState({ dragLatLng: latlng, dragged: true, location: "" });
  };

  /*render() {
    return (
      <Router>
        <div className="App">
          <Route
            path="/"
            render={() => (
              <Search
                moved={this.state.moved}
                location={this.state.location}
                onInputChange={this.handleInputChange}
                onNewLocation={this.locToLatLng}
              />
            )}
          />
          <Route
            path="/results"
            render={() => (
              <Results
                moved={this.state.moved}
                onRef={ref => (this.results = ref)}
                latlng={{ lat: this.state.lat, lng: this.state.lng }}
                onCenterChange={this.handleMove}
              />
            )}
          />
        </div>
      </Router>
    );
  }*/
  render() {
    return (
      <div>
        <Search
          search={this.state.search}
          location={this.state.location}
          onSearch={this.handleSearch}
          onInputChange={this.handleInputChange}
        />
        {this.state.search ? (
          <div>
            <Result />
            <Map
              latlng={this.state.latlng}
              onRef={ref => (this.map = ref)}
              onNewLatLng={this.handleNewLatLng}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default App;
