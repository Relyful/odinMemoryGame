import "../styles/cardsStyle.css"

export default function Cards({ pokemonArray }) {
  let cards = [];
  if (pokemonArray.length > 1) {
    cards = pokemonArray.map((pokemon) => {
      return (
        <div className="card" key={pokemon.id}>
          <div className="spriteName">{pokemon.name}</div>
          <img src={pokemon.pic} alt={pokemon.name} className="spritePic" />
        </div>
      );
    });
  }

  return (
    <div className="cardsContainer">
      {cards.length > 0 ? cards : <p>Loading cards...</p>}
    </div>
  );
}
