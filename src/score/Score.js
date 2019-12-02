import React from 'react';
import './index.css';

function Score(props){

  return (
    <div className="border">
    <h1 className="score">Score</h1>
    <h1 className="score">{props.score}</h1>
    </div>
  );
}

export default Score;
