import { useState, useEffect } from "react";
import Cards from "./components/Cards";
import "./App.css";

function App() {
  const [score, setScore] = useState(0);
  const [idArray, setIdArray] = useState([]);
  const [guessedSprite, setGuessedSprite] = useState([]);
  const [pokemonArray, setPokemonArray] = useState([]);
  const pokeCount = 1025;

  function idArrayReset() {
    for (let index = 0; index < 10; index++) {
      let number;
      do {
        number = Math.floor(Math.random() * pokeCount);  
              
      } while (idArray.includes(number));
      setIdArray((oldArray) => [...oldArray, number]);
    }
  }

  function addToGuessedSprite(spriteId) {
    setGuessedSprite((oldArray) => [...oldArray, spriteId]);
  }

  function increaseScore(number) {
    setScore(score + number);
  }

  //Choose pokemon on fresh load.
  if (idArray.length < 1) {
    idArrayReset();
  }

  useEffect(() => {
    //async fetch pokemon data here :))
    async function getPokemonData() {
      try {
        const pokemonData = [];
        for (const id of idArray) {
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
            pokemonData.push({ name: data.name, pic: data.image_uris.normal, id: id });
          }
          
        }
        console.log(pokemonData);
        setPokemonArray(pokemonData);
      } catch (error) {
        console.error(error);
      }
    }
    getPokemonData();

    return (
      setPokemonArray([])
    )
  }, [idArray]);

  return (
    <>
      <h1>Relyful&apos;s Memory Game</h1>
      <p className="intro">Click each sprite once and only once!</p>
      <Cards pokemonArray={pokemonArray} />
    </>
  );
}

export default App;
