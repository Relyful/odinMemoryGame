import { useState, useEffect } from "react";
import Cards from "./components/Cards";
import "./App.css";

function App() {
  const [score, setScore] = useState(-1);
  const [bestScore, setBestScore] = useState(0);
  const [guessedSprite, setGuessedSprite] = useState([]);
  const [spriteArray, setSpriteArray] = useState([]);
  const [resetCount, setResetCount] = useState(0);
  const [gameStatus, setGameStatus] = useState("start");
  const [cardAmm, setCardAmm] = useState(0);

  function addToGuessedSprite(spriteId) {
    setGuessedSprite((oldArray) => [...oldArray, spriteId]);
  }

  function increaseScore(number) {
    setScore(score + number);
  }

  function shuffleArray() {
    let shuffled = [];
    shuffled = spriteArray
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    setSpriteArray([...shuffled]);
  }

  function handleStartGame(e) {
    setCardAmm(Number(e.target.dataset.diff));
    setScore(0);
    setGameStatus("game");
  }

  function handleSetGameStart() {
    setScore(0);
    setGameStatus("start");
  }

  function endGame() {
    setGameStatus("end");
    if (score > bestScore) {
      setBestScore(score);
    }
    //Clear old cards while fetching new, reset score, clearGuessArray
    setSpriteArray([]);
    setGuessedSprite([]);
    setResetCount(resetCount + 1);
    console.log("RESET GAME AND REFETCH");
  }

  function handleSpriteClick(e) {
    //handle clicking duplicate card
    if (guessedSprite.includes(e.target.parentElement.dataset.id)) {
      endGame();
      return;
    }
    //Handle clicking correct card
    //Add ID of guessed sprite to list of guessed IDs
    addToGuessedSprite(e.target.parentElement.dataset.id);
    increaseScore(1);
    //Handle when all cards guessed    
    shuffleArray();
    return;
  }

  function returnDifficuilty() {
    switch (cardAmm) {
      case 5:
        return "Easy";
      case 10:
        return "Medium";
      case 15:
        return "Hard";
      default:
        break;
    }
  }

  useEffect(() => {
    if (score == cardAmm) {
      endGame();
      return;
    }
  }, [cardAmm, score]);

  useEffect(() => {
    //async fetch sprite data here :))
    async function getSpriteData(retryCount = 3) {
      try {
        setSpriteArray([]);
        const spriteData = [];
        for (let index = 0; index < cardAmm; index++) {
          const response = await fetch(
            `https://api.scryfall.com/cards/random`,
            {
              headers: {
                "User-Agent": "MTGMemoryGame",
                Accept: "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error(response);
          } else {
            const data = await response.json();
            spriteData.push({
              name: data.name,
              pic: data.image_uris.normal,
              id: data.id,
            });
          }
        }
        setSpriteArray(spriteData);
      } catch (error) {
        console.error(error);

        if (retryCount > 0) {
          console.log(`Retrying... Attempts left: ${retryCount - 1}`);
          getSpriteData(retryCount - 1);
        } else {
          console.log(`Failed to fetch data on all retrys.`);
        }
      }
    }
    getSpriteData();
  }, [resetCount, cardAmm]);

  if (gameStatus === "start") {
    return (
      <div className="container">
        <div className="header">
          <h1>
            Relyful&apos;s
            <br /> Memory Game
          </h1>
        </div>
        <div className="introduction">
          <p>Select difficulty</p>
          <div className="buttons">
            <button
              type="button"
              onClick={handleStartGame}
              data-diff={5}
              className="redBorder"
            >
              Easy
            </button>
            <button
              type="button"
              onClick={handleStartGame}
              data-diff={10}
              className="greenBorder"
            >
              Normal
            </button>
            <button
              type="button"
              onClick={handleStartGame}
              data-diff={15}
              className="blueBorder"
            >
              Hard
            </button>
          </div>
        </div>
      </div>
    );
  } else if (gameStatus === "game") {
    return (
      <>
        <div className="container">
          <div className="header">
            <h1>
              Relyful&apos;s
              <br /> Memory Game
            </h1>
            <p className="intro">Click each card only once!</p>
          </div>
          <div className="score">
            <div className="currScore">Score: {score}</div>
            <div className="bestScore">Best score: {bestScore}</div>
          </div>
          <Cards
            spriteArray={spriteArray}
            handleSpriteClick={handleSpriteClick}
          />
        </div>
      </>
    );
  } else if (gameStatus === "end") {
    return (
      <div className="container end">
        <h2>{score == cardAmm ? "YOU WIN!" : "GAME OVER!"}</h2>
        <p>{returnDifficuilty()} Difficulty</p>
        <p>Your score: {score}</p>
        <button type="button" onClick={handleSetGameStart}>
          Reset
        </button>
      </div>
    );
  }
}

export default App;
