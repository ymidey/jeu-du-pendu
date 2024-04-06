import React, { Component } from "react";
import './Hangman.css';
import BtnLetters from "../buttons/btn-letters/Btn-letters";
import BtnReset from "../buttons/btn-reset/Btn-reset";
import { fetchWord } from "../words/Words";
import img0 from '../../images/0.png';
import img1 from '../../images/1.png';
import img2 from '../../images/2.png';
import img3 from '../../images/3.png';
import img4 from '../../images/4.png';
import img5 from '../../images/5.png';
import img6 from '../../images/6.png';
import win from '../../images/win.gif';
import loose from '../../images/loose.gif';

class Hangman extends Component {
    static defaultProps = {
        maxTries: 6,
        images: [
            img0,
            img1,
            img2,
            img3,
            img4,
            img5,
            img6,
        ],
        allowedKeys: "abcdefghijklmnopqrstuvwxyz-"
    }

    state = {
        nbWrong: 0, // Nombre de mauvais mots
        word: '', // Mot à deviner
        guessed: new Set(), // Ensemble pour stocker les lettres devinées
        activeKey: '' // Stocker la touche active pour ajouter une classe CSS
    }

    componentDidMount() {
        this.handleNewWord();
        window.addEventListener("keydown", this.handleKeyPress);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyPress);
    }

    handleKeyPress = (event) => {
        const { allowedKeys } = this.props;
        const { key } = event;
        const { nbWrong, word, guessed } = this.state;

        if (nbWrong >= this.props.maxTries || word === '' || this.isGameOver() || !allowedKeys.includes(key.toLowerCase()) || guessed.has(key.toLowerCase())) {
            return; // Ignore les touches non autorisées, les touches déjà devinées, ou si le jeu est fini
        }

        this.handleGuess(key.toLowerCase()); // Appeler handleGuess avec la lettre devinée
        this.setState({ activeKey: key.toLowerCase() }); // Mettre à jour la touche active
    }

    isGameOver = () => {
        const { word, guessed } = this.state;
        return word.replace(/ /g, '') === this.guessedWord().replace(/ /g, '') || this.state.nbWrong >= this.props.maxTries;
    }


    reset = () => {
        this.setState({
            nbWrong: 0, // Réinitialiser le nombre de mauvais mots
            guessed: new Set() // Réinitialiser l'ensemble guessed
        }, () => {
            this.handleNewWord(); // Appeler handleNewWord après que l'état ait été réinitialisé
        });
    }

    guessedWord = () => {
        const { word, guessed } = this.state;
        return word
            .split('') // Diviser le mot en lettres
            .map(ltr => (guessed.has(ltr) ? ltr : '_')) // Remplacer les lettres non devinées par des tirets
            .join(' '); // Rejoindre les lettres avec des espaces
    }

    handleGuess = (ltr) => {
        this.setState(ps => ({
            guessed: ps.guessed.add(ltr), // Ajouter la lettre devinée à l'ensemble guessed
            nbWrong: ps.nbWrong + (ps.word.includes(ltr) ? 0 : 1) // Incrémenter le nombre de mauvais mots si la lettre n'est pas dans le mot

        }))
    };

    // Fonction pour charger un nouveau mot
    handleNewWord = () => {
        const lang = 'fr-FR';

        fetchWord(lang)
            .then(word => {
                this.setState({ word }); // Mettre à jour l'état avec le nouveau mot
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        const { maxTries } = this.props;
        const { nbWrong, word } = this.state;
        let isWinner = this.guessedWord().replace(/ /g, '') === word.replace(/ /g, '');
        let gameOver = nbWrong >= maxTries;

        let gameState = !isWinner && !gameOver ? (
            <BtnLetters allowedKeys={this.props.allowedKeys} guessed={this.state.guessed} onGuess={this.handleGuess} activeKey={this.state.activeKey} />
        ) : isWinner ? (
            <div>
                <p>Vous avez gagné !</p>
                <img src={win} alt="Win GIF" />
                <p>Vous avez trouvé le mot : <span className="strong">{word}</span></p>
            </div>
        ) : (
            <div>
                <p>Vous avez perdu !</p>
                <img src={loose} alt="Loose GIF" />
                <p>Le mot à trouver était : <span className="strong">{word}</span></p>
            </div>
        );


        return (
            <div className="Hangman">
                <h1>Jeu du pendu</h1>
                <img src={this.props.images[nbWrong]} alt={`${nbWrong}/${maxTries}`} />
                <div className="btns">
                    {gameState}
                </div>
                {!isWinner && !gameOver && (
                    <p className="Hangman-word">{this.guessedWord()}</p>
                )}
                <BtnReset onReset={this.reset} />
            </div>
        );
    }

}

export default Hangman;
