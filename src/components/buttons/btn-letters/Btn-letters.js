import React, { Component } from "react";
import './Btn-letters.css';

class Buttons extends Component {
    generateButtons() {
        return "abcdefghijklmnopqrstuvwxyz-".split("").map(ltr => (
            <button
                key={ltr}
                value={ltr}
                onClick={() => this.props.onGuess(ltr)}
                disabled={this.props.guessed.has(ltr)}
                className={this.props.activeKey === ltr ? 'bounce' : ''}
            >
                {ltr}
            </button>
        ));
    }


    render() {
        return <div className="btn-letters">
            {this.generateButtons()}
        </div>;
    };
}

export default Buttons;
