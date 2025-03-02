import React, { Component } from "react";
import './Btn-letters.css';

// Fonction de normalisation des caractères
const normalizeChar = (char) => {
    return char.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

class Buttons extends Component {
    generateButtons() {
        const normalizedGuessed = new Set(
            [...this.props.guessed].map(normalizeChar)
        );

        return "abcdefghijklmnopqrstuvwxyz-".split("").map(ltr => {
            const normalizedLtr = normalizeChar(ltr);
            const isDisabled = normalizedGuessed.has(normalizedLtr);

            return (
                <button
                    key={ltr}
                    value={normalizedLtr} // On passe la version normalisée
                    onClick={() => this.props.onGuess(normalizedLtr)}
                    disabled={isDisabled}
                    className={this.props.activeKey === normalizedLtr ? 'bounce' : ''}
                >
                    {ltr}
                </button>
            );
        });
    }

    render() {
        return <div className="btn-letters">{this.generateButtons()}</div>;
    }
}

export default Buttons;