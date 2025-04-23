import React, { useEffect, useState } from "react";
const SIZE = 4;

const createEmptyBoard = () => {
  return Array(SIZE)
    .fill(null)
    .map(() => Array(SIZE).fill(0));
};

const addRandomTile = (board) => {
  const empty = [];
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) {
        empty.push([i, j]);
      }
    });
  });
  if (empty.length === 0) return null;
  const [x, y] = empty[Math.floor(Math.random() * empty.length)];
  board[x][y] = Math.random() < 0.9 ? 2 : 4;
  return board;
};

const slide = (row) => {
  const newRow = row.filter((num) => num !== 0);
  while (newRow.length < SIZE) {
    newRow.push(0);
  }
  return newRow;
};

const combine = (row) => {
  let newScore = 0;
  row.forEach((_, i) => {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      newScore += row[i];
    }
  });
  return { row, newScore };
};

const operate = (row) => {
  row = slide(row);
  const { row: combinedRow, newScore } = combine(row);
  row = slide(combinedRow);
  return { row, score: newScore };
};

const transpose = (grid) => {
  return grid[0].map((_, i) => grid.map((row) => row[i]));
};

const cloneBoard = (board) => {
  return board.map((row) => [...row]);
};

const GameBoard = () => {
  const [board, setBoard] = useState(
    addRandomTile(addRandomTile(createEmptyBoard()))
  );
  const [score, setScore] = useState(0);

  const resetGame = () => {
    const newBoard = addRandomTile(addRandomTile(createEmptyBoard()));
    setBoard(newBoard);
    setScore(0);
  };

  const handleKeyDown = (event) => {
    const oldBoard = cloneBoard(board);
    let newBoard = [];
    let tempScore = 0;

    const isGameOver = () => {
      const testBoard = cloneBoard(board);
      const directions = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
      for (const direction of directions) {
        const clone = JSON.parse(JSON.stringify(testBoard));
        let moved = false;
        
        switch (direction) {
          case "ArrowLeft":
            moved = JSON.stringify(clone.map((row) => operate(row)) !== JSON.stringify(clone));
            break;

          case "ArrowRight":
            moved = JSON.stringify(clone.map((row) => operate([...row].reverse()).reverse()) !== JSON.stringify(clone));
            break;
          case "ArrowUp":
            let t1 = transpose(clone);
            let t2 = t1.map((row) => operate(row));
            moved = JSON.stringify(t2) !== JSON.stringify(clone);
            break;
            case "ArrowDown": 
            let t3 = transpose(clone);
            let t4 = t3.map((row) => operate([...row].reverse()).reverse());
            moved = JSON.stringify(t4) !== JSON.stringify(clone);
            break;

            default:
            return;
        }
        if (moved) {
          return false;
        }
      }
      return true;
    }
    if (isGameOver()) {
      alert("Game Over! Your score: " + score);
      resetGame();
      return;
    }
    
    switch (event.key) {
      case "ArrowLeft":
        newBoard = board.map((row) => {
          const { row: newRow, score } = operate(row);
          tempScore += score;
          return newRow;
        });
        break;

      case "ArrowRight":
        newBoard = board.map((row) => {
          const { row: newRow, score } = operate([...row].reverse());
          tempScore += score;
          return newRow.reverse();
        });
        break;

      case "ArrowUp":
        newBoard = transpose(board);
        console.log('transpose :>> ', newBoard);
        newBoard = newBoard.map((row) => {
          const { row: newRow, score } = operate(row);
          tempScore += score;
          return newRow;
        });
        newBoard = transpose(newBoard);
        break;

      case "ArrowDown":
        newBoard = transpose(board);
        newBoard = newBoard.map((row) => {
          const { row: newRow, score } = operate([...row].reverse());
          tempScore += score;
          return newRow.reverse();
        });
        newBoard = transpose(newBoard);
        break;

      default:
        return;
    }
    if (JSON.stringify(oldBoard) !== JSON.stringify(newBoard)) {
      setBoard(addRandomTile(newBoard));
      setScore((prevScore) => prevScore + tempScore);
    }
  };
console.log(`board: ${board}`);
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="score">Score: {score}</div>
      <div className="grid">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div key={`${i}-${j}`} className={`cell cell-${cell}`}>
              {cell !== 0 ? cell : ""}
            </div>
          ))
        )}
      </div>
      <button className="reset-button" onClick={resetGame}>
        Reset Game
      </button>
    </>
  );
};

export default GameBoard;
