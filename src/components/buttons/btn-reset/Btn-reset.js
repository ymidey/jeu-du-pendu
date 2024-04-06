import React, { Component } from "react";
import './Btn-reset.css';

class BtnReset extends Component {
    render() {
        return (
            <button className="btn-reset" onClick={this.props.onReset}>
                Recommencer avec un autre mot ?
            </button>
        );
    }
}

export default BtnReset;