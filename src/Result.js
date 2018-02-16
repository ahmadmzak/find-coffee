import React, { Component } from "react";

class Result extends Component {
  render() {
    let url = "http://via.placeholder.com/100x100";
    const res = this.props.result;
    if (res.photos && res.photos[0] !== undefined) {
      url = res.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 });
    }
    return (
      <li>
        <div className="result">
          <img
            src={url}
            alt="pic"
            style={{ width: "100px", height: "100px" }}
          />
          <div className="details">
            <div className="title-head">
              <h3 className="title">{`${this.props.idx + 1}. ${res.name}`}</h3>
              <h4 className="rating">{`${res.rating}`}</h4>
            </div>
            <div className="address">{`${res.formatted_address}`}</div>
            <br />
            <img
              src={res.icon}
              alt="icon"
              style={{ width: "25px", height: "25px" }}
            />
            <br />
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
        <hr />
      </li>
    );
  }
}

export default Result;
