import { useState, useEffect } from "react";
import Cards from "./components/Cards";
import "./App.css";

function App() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [guessedSprite, setGuessedSprite] = useState([]);
  const [spriteArray, setSpriteArray] = useState([]);
  const [resetCount, setResetCount] = useState(0);
  const [gameStatus, setGameStatus] = useState('start');
  const [cardAmm, setCardAmm] = useState(0);


  function addToGuessedSprite(spriteId) {
    setGuessedSprite((oldArray) => [...oldArray, spriteId]);
  }

  function increaseScore(number) {
    setScore(score + number);
  }

  function shuffleArray() {
    console.log(spriteArray);
    let shuffled = [];
    shuffled = spriteArray
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

    console.log(shuffled);
    setSpriteArray([...shuffled]);
  }

  function handleStartGame(e) {
    console.log(e.target.dataset.diff);
    setCardAmm(Number(e.target.dataset.diff));
    setGameStatus("game");
  }

  function handleSetGameStart() {
    setScore(0);
    setGameStatus('start');
  }

  function handleSpriteClick(e) {
    //handle clicking duplicate card
    if (guessedSprite.includes(e.target.parentElement.dataset.id)) {
      //TODO: handle the reset on wrong choice 
      setGameStatus('end');     
      if (score > bestScore) {
        setBestScore(score);        
      }
      //Clear old cards while fetching new, reset score, clearGuessArray  
      setSpriteArray([]);      
      setGuessedSprite([]);
      setResetCount(resetCount + 1);
      console.log('RESET GAME AND REFETCH');    
      return
    }
    //Handle clicking correct card
    //Add ID of guessed sprite to list of guessed IDs
    addToGuessedSprite(e.target.parentElement.dataset.id);
    increaseScore(1);
    shuffleArray();
  }


  useEffect(() => {
    //async fetch sprite data here :))
    async function getSpriteData() {
      try {
        setSpriteArray([]);
        const spriteData = [];
        console.log('cardAmm: ' , cardAmm);
        for (let index = 0; index < cardAmm; index++) {
          
          // const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const response = await fetch(`https://api.scryfall.com/cards/random`, {
            headers: {
              'User-Agent': 'MTGMemoryGame',
              'Accept': 'application/json'
            }
          });
          if (!response.ok) {
            console.log(response);
            // throw new Error(`Failed to fetch data for ID: ${id}`);
            throw new Error(response);
          } else {
            const data = await response.json();
            // pokemonData.push({ name: data.name, spriteUrl: data.sprites.front_default });
            spriteData.push({ name: data.name, pic: data.image_uris.normal, id: data.id });
          }
          
        }
        console.log(spriteData);
        setSpriteArray(spriteData);
      } catch (error) {
        console.error(error);
      }
    }
    getSpriteData();

  }, [resetCount, cardAmm]);

  if (gameStatus === "start") {
    return (
      <div className="container">
        <div className="header">
        <h1>Relyful&apos;s<br /> Memory Game</h1>
        </div>
        <div className="introduction">
          <p>Select difficulty</p>
          <div className="buttons">
            <button type="button" onClick={handleStartGame} data-diff={5} className="redBorder">Easy</button>
            <button type="button" onClick={handleStartGame} data-diff={10} className="greenBorder">Normal</button>
            <button type="button" onClick={handleStartGame} data-diff={15} className="blueBorder">Hard</button>
          </div>
        </div>
      </div>
    )
  } else if (gameStatus === "game") {
    return (
      <>
        <div className="container">
          <div className="header">
            <h1>Relyful&apos;s<br /> Memory Game</h1>
            <p className="intro">Click each card only once!</p>
          </div>
          <div className="score">
            <div className="currScore">Score: {score}</div>
            <div className="bestScore">Best score: {bestScore}</div>
          </div>
          <Cards spriteArray={spriteArray} handleSpriteClick={handleSpriteClick} />
        </div>
      </>
    );
  } else if (gameStatus === "end") {
    return (
      <>
        <h2>GAME OVER!</h2>
        <p>Your score: {score}</p>
        <button type="button" onClick={handleSetGameStart}>Reset</button>
      </>
    )   
  } 
}

export default App;
