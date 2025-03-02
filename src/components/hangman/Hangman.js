import React, { useState, useEffect, useCallback } from "react";
import "./Hangman.css";
import BtnLetters from "../buttons/btn-letters/Btn-letters";
import BtnReset from "../buttons/btn-reset/Btn-reset";
import { fetchWord } from "../words/Words";
import img0 from "../../images/0.png";
import img1 from "../../images/1.png";
import img2 from "../../images/2.png";
import img3 from "../../images/3.png";
import img4 from "../../images/4.png";
import img5 from "../../images/5.png";
import img6 from "../../images/6.png";
import win from "../../images/win.gif";
import loose from "../../images/loose.gif";

const defaultProps = {
    maxTries: 6,
    images: [img0, img1, img2, img3, img4, img5, img6],
    allowedKeys: "abcdefghijklmnopqrstuvwxyz-"
};

const Hangman = ({ maxTries, images, allowedKeys }) => {
    const [nbWrong, setNbWrong] = useState(0);
    const [word, setWord] = useState("");
    const [guessed, setGuessed] = useState(new Set());
    const [activeKey, setActiveKey] = useState("");

    // Normaliser une chaîne en retirant les accents et en la passant en minuscule
    const normalizeString = (str) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    // Calculer le mot deviné en fonction des lettres trouvées
    const guessedWord = useCallback(() => {
        const guessedNormalized = new Set(
            [...guessed].map((g) => normalizeString(g))
        );
        return word
            .split("")
            .map((ltr) =>
                guessedNormalized.has(normalizeString(ltr)) ? ltr : "_"
            )
            .join(" ");
    }, [word, guessed]);

    // Vérifier si la partie est finie : soit victoire, soit trop d'erreurs
    const isGameOver = useCallback(() => {
        const cleanWord = word.replace(/\s/g, "");
        const cleanGuessed = guessedWord().replace(/\s/g, "");
        return cleanWord === cleanGuessed || nbWrong >= maxTries;
    }, [word, guessedWord, nbWrong, maxTries]);

    // Charger un nouveau mot
    const handleNewWord = useCallback(() => {
        fetchWord("fr-FR")
            .then((newWord) => setWord(newWord))
            .catch((err) => console.error(err));
    }, []);

    // Charger le mot au montage du composant
    useEffect(() => {
        handleNewWord();
    }, [handleNewWord]);

    // Gérer une lettre devinée
    const handleGuess = useCallback(
        (ltr) => {
            setGuessed((prev) => new Set([...prev, ltr]));
            const normalizedWord = normalizeString(word);
            const normalizedLtr = normalizeString(ltr);
            if (!normalizedWord.includes(normalizedLtr)) {
                setNbWrong((prev) => prev + 1);
            }
        },
        [word]
    );

    // Gérer l'appui sur une touche du clavier
    const handleKeyPress = useCallback(
        (event) => {
            const key = event.key.toLowerCase();

            if (
                nbWrong >= maxTries ||
                !word ||
                isGameOver() ||
                !allowedKeys.includes(key) ||
                guessed.has(key)
            ) {
                return;
            }
            handleGuess(key);
            setActiveKey(key);
            setTimeout(() => setActiveKey(""), 500);
        },
        [nbWrong, maxTries, word, isGameOver, allowedKeys, guessed, handleGuess]
    );

    // Ajout et nettoyage de l'écouteur d'événement pour le clavier
    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [handleKeyPress]);

    // Réinitialiser le jeu
    const reset = () => {
        setNbWrong(0);
        setGuessed(new Set());
        handleNewWord();
    };

    const currentGuessedWord = guessedWord();
    const isWinner =
        currentGuessedWord.replace(/\s/g, "") === word.replace(/\s/g, "");
    const gameOver = nbWrong >= maxTries;

    let gameState;
    if (!isWinner && !gameOver) {
        gameState = (
            <BtnLetters
                allowedKeys={allowedKeys}
                guessed={guessed}
                onGuess={handleGuess}
                activeKey={activeKey}
            />
        );
    } else if (isWinner) {
        gameState = (
            <div>
                <p>Vous avez gagné !</p>
                <img src={win} alt="Win GIF" />
                <p>
                    Vous avez trouvé le mot : <span className="strong">{word}</span>
                </p>
            </div>
        );
    } else {
        gameState = (
            <div>
                <p>Vous avez perdu !</p>
                <img src={loose} alt="Loose GIF" />
                <p>
                    Le mot à trouver était : <span className="strong">{word}</span>
                </p>
            </div>
        );
    }

    return (
        <div className="Hangman">
            <h1>Jeu du pendu</h1>
            <img
                src={images[nbWrong]}
                alt={`Nombre d'erreur avant de perdre : ${nbWrong}/${maxTries}`}
            />
            <div className="btns">{gameState}</div>
            {!isWinner && !gameOver && (
                <p className="Hangman-word">{currentGuessedWord}</p>
            )}
            <BtnReset onReset={reset} />
        </div>
    );
};

Hangman.defaultProps = defaultProps;

export default Hangman;
