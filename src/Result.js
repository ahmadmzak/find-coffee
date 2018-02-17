import React, { Component } from "react";
import blank from "./blank.png";

class Result extends Component {
  render() {
    let url = blank;
    const res = this.props.result;
    let rating = res.rating;
    if (res.photos && res.photos[0] !== undefined) {
      url = res.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 });
    }
    if (res.rating === undefined) {
      rating = "N/A";
    } else if (Number.isInteger(res.rating)) {
      rating = `${res.rating}.0`;
    }
    return (
      <li>
        <div className="result">
          <img className="result-img" src={url} alt="pic" />
          <div className="details">
            <div className="title-head">
              <h3 className="title">{`${this.props.idx + 1}. ${res.name}`}</h3>
              <h4 className="rating">{rating}</h4>
            </div>
            <div className="address">{`${res.formatted_address}`}</div>
            <br />
            <div style={{ display: "flex" }}>
              <img
                src={res.icon}
                alt="icon"
                style={{ width: "25px", height: "25px", marginRight: "15px" }}
              />
              {res.opening_hours ? (
                <h2
                  style={
                    res.opening_hours.open_now
                      ? { color: "green" }
                      : { color: "red" }
                  }
                >
                  {res.opening_hours.open_now ? "OPEN" : "CLOSED"}
                </h2>
              ) : null}
            </div>
          </div>
        </div>
        <hr />
      </li>
    );
  }
}

export default Result;
