import { useState } from 'react'
import './App.css'

function App() {
  const [score, setScore] = useState(0);
  const [idArray, setIdArray] = useState([]);
  const pokeCount = 1025;
  

  if (idArray.length < 1) {
    for (let index = 0; index < 10; index++) {
      const number = Math.floor(Math.random() * pokeCount);
      setIdArray(oldArray => [...oldArray, number]);
    }
  }
  
  return (
    <>
      <h1>Relyful&apos;s Memory Game</h1>
      <p className="intro">Click each sprite once and only once!</p>
      {/* cards component here */}
    </>
  )
}

export default App
