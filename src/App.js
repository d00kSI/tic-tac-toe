// useState is used to remember the current state of an element
import { useState } from "react";

// Defines an empty square which triggers the function onSquareClick when clicked
function Square({ value, onSquareClick }) {
  return (
    // The button has a class of square and the value of the square (X, O, or null)
    <button className={`square ${value}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

//
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    // Checks if there is a winner or if the square is already filled and exists if true
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // Copies the squares array
    const nextSquares = squares.slice();
    // Changes the value of the square to X or O
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    // Calls the onPlay function with the new squares array
    onPlay(nextSquares);
  }

  // Checks if there is a winner and either writes it down if there is, or writes down the next player if there isn't
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // Returns the status and the squares, calls handleClick when a square is clicked with the index of the square
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// The keyword default defines this function as the main one to be exported
export default function Game() {
  // useState is used to remember the current state of the board
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // useState is used to remember the current move in currentMove and setCurrrentMove is used to change it
  const [currentMove, setCurrentMove] = useState(0);
  // xIsNext is true if the current move is even
  const xIsNext = currentMove % 2 === 0;
  // currentSquares is the board state of the current move
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    // nextHistory is a copy of the history array with the added current move
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    // Sets the history to nextHistory and the current move to the last move
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Sets the current move to the next move
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Maps the history array to a list of buttons that allow the user to jump to a previous move
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      // The button has an onClick event that calls jumpTo with the move number
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // Returns the board with the current state, the list of moves, and the current player
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// Defines the winning combinations and checks if they were realized
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
