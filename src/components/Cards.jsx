import "../styles/cardsStyle.css"

export default function Cards({ spriteArray, handleSpriteClick }) {
  let cards = [];
  if (spriteArray.length > 1) {
    cards = spriteArray.map((sprite) => {
      return (
        <div className="card" key={sprite.id} data-id={sprite.id}>
          <div className="spriteName">{sprite.name}</div>
          <img src={sprite.pic} alt={sprite.name} className="spritePic" onClick={handleSpriteClick} />
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
