import { useState } from "react";
import "./App.css";

function App() {
  const [score, setScore] = useState(0);
  const [idArray, setIdArray] = useState([]);
  const [guessedSprite, setGuessedSprite] = useState([]);
  const pokeCount = 1025;
  
  
  function idArrayReset() {
    for (let index = 0; index < 10; index++) {
      const number = Math.floor(Math.random() * pokeCount);
      setIdArray((oldArray) => [...oldArray, number]);
    }
  }

  function addToGuessedSprite(spriteId) {
    setGuessedSprite(oldArray => [...oldArray, spriteId]);
  };

  function increaseScore(number) {
    setScore(score + number);
  };
  

  //Choose pokemon on fresh load.
  if (idArray.length < 1) {
    idArrayReset();
  };

  return (
    <>
      <h1>Relyful&apos;s Memory Game</h1>
      <p className="intro">Click each sprite once and only once!</p>
      {/* cards component here */}
    </>
  );
}

export default App;
