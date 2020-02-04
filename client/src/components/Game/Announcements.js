import React from 'react';

export function Winner(props) {
  let player = props.player.name;
  return (
    <div id="winner">
      <div>
        <p>{player} has won the game!</p>
        <button onClick={props.restart}>Play again?</button>
      </div>
    </div>
  );
}

  export default Winner;
