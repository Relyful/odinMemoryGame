import { useState, useEffect } from "react";
import Cards from "./components/Cards";
import "./App.css";

function App() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [guessedSprite, setGuessedSprite] = useState([]);
  const [spriteArray, setSpriteArray] = useState([]);
  const [resetCount, setResetCount] = useState(0);
  const cardAmm = 10;


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

  function handleSpriteClick(e) {
    //handle clicking duplicate card
    if (guessedSprite.includes(e.target.parentElement.dataset.id)) {
      //TODO: handle the reset on wrong choice      
      if (score > bestScore) {
        setBestScore(score);        
      }
      //Clear old cards while fetching new, reset score, clearGuessArray  
      setSpriteArray([]);
      setScore(0);
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
        const spriteData = [];
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

  }, [resetCount]);

  return (
    <>
      <h1>Relyful&apos;s Memory Game</h1>
      <p className="intro">Click each sprite once and only once!</p>
      <div className="score">
        <div className="currScore">Score: {score}</div>
        <div className="bestScore">Best score: {bestScore}</div>
      </div>
      <Cards spriteArray={spriteArray} handleSpriteClick={handleSpriteClick} />
    </>
  );
}

export default App;
