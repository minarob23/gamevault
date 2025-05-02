import React from 'react';

function GameDetails({ selectedGame }) {
  return (
    <div>
      <h1>{selectedGame.title}</h1>
      <p>{selectedGame.description}</p>
      <a href={selectedGame.link} target="_blank" rel="noreferrer">
        Learn More
      </a>
    </div>
  );
}

export default GameDetails;