import React, { Component } from "react";

class Result extends Component {
  render() {
    let url = "";
    const res = this.props.result;
    if (res.photos[0] !== undefined) {
      url = res.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 });
    }
    return (
      <li>
        <img src={url} alt="pic" style={{ width: "100px", height: "100px" }} />
        <h2>{`${this.props.idx + 1}. ${res.name} ${res.rating}`}</h2>
        <img
          src={res.icon}
          alt="icon"
          style={{ width: "25px", height: "25px" }}
        />
        <h3>{`${res.vicinity}`}</h3>
        {res.opening_hours ? (
          <h2>{res.opening_hours.open_now ? "OPEN" : "CLOSED"}</h2>
        ) : null}
      </li>
    );
  }
}

export default Result;
