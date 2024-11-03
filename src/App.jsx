import { useState, useEffect } from "react";
import Cards from "./components/Cards";
import "./App.css";

function App() {
  const [score, setScore] = useState(0);
  const [guessedSprite, setGuessedSprite] = useState([]);
  const [spriteArray, setSpriteArray] = useState([]);
  const cardAmm = 10;


  function addToGuessedSprite(spriteId) {
    setGuessedSprite((oldArray) => [...oldArray, spriteId]);
  }

  function increaseScore(number) {
    setScore(score + number);
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

    return (
      setSpriteArray([])
    )
  }, []);

  return (
    <>
      <h1>Relyful&apos;s Memory Game</h1>
      <p className="intro">Click each sprite once and only once!</p>
      <Cards spriteArray={spriteArray} />
    </>
  );
}

export default App;
