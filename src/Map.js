import React, { Component } from "react";

class Map extends Component {
  state = {
    map: null,
    markers: []
  };

  componentDidMount() {
    const URL =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyD_onVU5ZwEAELU89hcWVU8YLfgR1wbZdk&libraries=places";

    const scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      document.body.appendChild(script);
      script.onload = resolve;
      script.onerror = reject;
      script.async = true;
      script.defer = true;
      script.src = URL;
    });
    scriptPromise.then(() => {
      this.initMap();
    });
    this.props.onRef(this);
  }

  initMap = () => {
    const defaultCenter = { lat: 40.7590403, lng: -74.0392711 };
    const defaultZoom = 12;
    const map = new window.google.maps.Map(this.map, {
      center: this.props.latlng || defaultCenter,
      zoom: this.props.latlng ? 12 : defaultZoom,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: window.google.maps.ControlPosition.TOP_CENTER
      },
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.LEFT_CENTER
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
        position: window.google.maps.ControlPosition.LEFT_TOP
      },
      fullscreenControl: true,
      gestureHandling: "cooperative"
    });

    map.addListener("dragend", e => {
      const latlng = {
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng()
      };
      this.props.onNewLatLng(latlng);
    });

    this.setState({ map });
    this.getResults(this.props.latlng);
  };

  callBack = (results, status) => {
    let markers = [];
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      this.props.onNewResults(results);
      for (let i = 0; i < results.length; i++) {
        if (i === 0) {
          this.state.map.setCenter(results[i].geometry.location);
        }
        if (!results[i].permanently_closed) {
          markers.push(this.createMarker(results[i], this.state.map));
        }
      }
      this.setState({
        markers
      });
    } else {
      console.error("Zero results");
    }
  };

  createMarker = (place, map) => {
    const infowindow = new window.google.maps.InfoWindow();
    const marker = new window.google.maps.Marker({
      map: map,
      position: place.geometry.location
    });
    window.google.maps.event.addListener(marker, "click", function() {
      infowindow.setContent("<div><strong>" + place.name + "</div>");
      infowindow.open(map, this);
    });
    return marker;
  };

  clearMarkers = () => {
    for (let m in this.state.markers) {
      this.state.markers[m].setMap(null);
    }
    this.setState({
      markers: []
    });
  };

  getResults = latlng => {
    const service = new window.google.maps.places.PlacesService(this.state.map);
    this.clearMarkers();
    this.state.map.setCenter(latlng);
    /*service.nearbySearch(
      {
        location: latlng,
        radius: 8000,
        type: ["cafe"]
      },
      this.callBack
    );*/
    service.textSearch(
      {
        location: latlng,
        radius: 8000,
        query: "coffee"
      },
      this.callBack
    );
  };

  render() {
    return (
      <div
        className="gmap"
        ref={r => {
          this.map = r;
        }}
      />
    );
  }
}

export default Map;
