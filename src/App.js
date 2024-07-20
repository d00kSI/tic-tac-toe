// useState is used to remember the current state of an element
import { useState } from "react";

// Defines an empty square which triggers the function onSquareClick when clicked
function Square({ value, onSquareClick, isHighlighted }) {
  return (
    /* The button gets a class of square, the value of the square (X, O, or null) 
    and highlighted if it is a part of the winning combination */
    <button
      className={`square ${value} ${isHighlighted ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    // Checks if there is a winner or if the square is already filled and exits if true
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // Copies the squares array
    const nextSquares = squares.slice();
    // Changes the value of the next square to X or O according to the value of xIsNext
    nextSquares[i] = xIsNext ? "X" : "O";
      // Calls the onPlay function with the new squares array
    onPlay(nextSquares);
  }

  // Checks if there is a winner and either writes it down if there is, or writes down the next player if there isn't
  const winner = calculateWinner(squares);
  let status;
  status = winner ? "Winner: " + winner[0] : "Next player: " + (xIsNext ? "X" : "O");

  /* Creates an array of 3 rows where each row is a div element with the class board-row. 
  Inside each row there is another array of 3 squares as Square components.
  The appropriate value for onSquareClick is passed to the Square component based on the current row and column. */
  const boardRows = Array.from({ length: 3 }, (_, rowIndex) => (
    <div key={rowIndex} className="board-row">
      {Array.from({ length: 3 }, (_, colIndex) => {
        const index = rowIndex * 3 + colIndex;
        const isWinningSquare = winner && winner.includes(index);
        return (
          <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
            isHighlighted={isWinningSquare}
          />
        );
      })}
    </div>
  ));

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

// The keyword default defines this function as the main one to be exported
export default function Game() {
  // useState is used to remember the current state of the board
  const [history, setHistory] = useState([{
    squares: Array(9).fill(null),
    row: null,
    col: null
  }]);

  // useState is used to remember the current move in currentMove and setCurrrentMove is used to change it
  const [currentMove, setCurrentMove] = useState(0);
  // xIsNext is true if the current move is even
  const xIsNext = currentMove % 2 === 0;
  // currentSquares is the board state of the current move
  const currentSquares = history[currentMove].squares;
  
  // Determines the difference between previous and current squares and saves it as an array
  function getIndexOfTheLastSquare(previousSquares, currentSquares) {
    for (let i = 0; i < previousSquares.length; i++) {
      // Checks if the elements are different and returns the index of the different element (i)
      if (previousSquares[i] != currentSquares[i]) {
        return i;
      }
    }
  }

  // Updates the game state when a player makes a move
  function handlePlay(nextSquares) {
    // Retrieve the squares from the previous move to compare with the current move
    const previousSquares = history[currentMove].squares;
    // Get the index of the square that was changed in the current move
    let index = getIndexOfTheLastSquare(previousSquares, nextSquares);

    // Calculates the row and column based on the index of the new square
    const row = Math.floor(index / 3) + 1;
    const col = index % 3 + 1;
    
    // Create the next history state by appending the new squares, row, and column to the existing history
    const nextHistory = [...history.slice(0, currentMove + 1), {
      squares: nextSquares,
      row: row,
      col: col
    }];
    
    // Update the history state and set the current move to the latest move
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Sets the current move to the next move
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Maps the history array to a list of buttons that allow the user to jump to a previous move
  const moves = history.map((entry, move) => {
    let description; 

    if (move === currentMove) {
      description = "You are at move #" + move;
    } else if (move > 0) {
      description = `Go to move #${move} (${entry.row}, ${entry.col})`;
    } else {
      description = "Go to game start";
    }

    if (move >= 0 && move !== currentMove) {
      return (
        // The button has an onClick event that calls jumpTo with the move number
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    } else if (move === currentMove) {
      return (
        // The button has an onClick event that calls jumpTo with the move number
        <li className="currentMove" key={move}>
          {description}
        </li>
      );
    }
  });

  /* useState hook is used to manage the order of moves displayed in the game history
  The initial state is set to true, indicating that the moves are displayed in ascending order */
  const [isAscending, setIsAscending] = useState(true);

  /* Function to toggle the order of the moves displayed in the game history.
  When called, it reverses the current order by setting isAscending to its opposite value. */
  const handleToggleOrder = () => {
    setIsAscending(!isAscending);
  };

  /* Returns the board with the current state, the list of moves, and the current player
  Includes a Toggle Move Order button that reverses the move order if it is currently ascending. */
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={handleToggleOrder}>Toggle Move Order</button>
        <ol>{isAscending ? moves : moves.slice().reverse()}</ol>
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
      const winningCombination = [squares[a], a, b, c];
      return winningCombination;
    }
  }
  return null;
}
