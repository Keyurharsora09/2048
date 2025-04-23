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

const cloneBoard = (board) => {
  return board.map((row) => [...row]);
};

const slide = (row) => {
  const newRow = row.filter((num) => num !== 0);
  while (newRow.length < SIZE) {
    newRow.push(0);
  }
  return newRow;
};

const combine = (row) => {
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
    }
  }
  return row;
};

const operate = (row) => {
  row = slide(row);
  row = combine(row);
  row = slide(row);
  return row;
};

const transpose = (grid) => {
  return grid[0].map((_, i) => grid.map((row) => row[i]));
};

const Game = () => {
  const [board, setBoard] = useState(
    addRandomTile(addRandomTile(createEmptyBoard()))
  );
  // const resetGame = () => {
  //   const newBoard = addRandomTile(addRandomTile(createEmptyBoard()));
  //   setBoard(newBoard);
  //   setScore(0);
  // };

  const handleKeyDown = (event) => {
    const oldBoard = cloneBoard(board);
    let newBoard = [];
    console.log(`oldboard: ${oldBoard}`);

    switch (event.key) {
      case "ArrowLeft":
        newBoard = board.map((row) => operate(row));

        console.log(`newBoard after ArrowLeft: ${newBoard}`);
        break;

      case "ArrowRight":
        newBoard = board.map((row) => operate([...row].reverse()).reverse());

        console.log(`newBoard after ArrowRight: ${newBoard}`);
        break;

      case "ArrowUp":
        newBoard = transpose(board);
        newBoard = newBoard.map((row) => operate(row));
        newBoard = transpose(newBoard);
        console.log(`newBoard after ArrowUp: ${newBoard}`);
        break;

      case "ArrowDown":
        newBoard = transpose(board);
        newBoard = newBoard.map((row) => operate([...row].reverse()).reverse());
        newBoard = transpose(newBoard);
        console.log(`newBoard after ArrowDown: ${newBoard}`);
        break;

      default:
        return;
    }
    // const checkGameOver = () => {
      //   for (let i = 0; i < SIZE; i++) {
      //     for (let j = 0; j < SIZE; j++) {
      //       if (board[i][j] === 0) return false;
      //       if (i < SIZE - 1 && board[i][j] === board[i + 1][j]) return false;
      //       if (j < SIZE - 1 && board[i][j] === board[i][j + 1]) return false;
      //     }
      //   }
      //   alert("Game Over! Your score: " + score);
      //   resetGame();
      //   return true;
      // };
    
      // useEffect(() => {
      //   if (checkGameOver()) {
      //     resetGame();
      //   }
      // }, [board]);
      
    if(JSON.stringify(oldBoard) !== JSON.stringify(newBoard)) {
       return setBoard(addRandomTile(newBoard));
    }
};

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="grid">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div key={`${i}-${j}`} className={`cell cell-${cell}`}>
              {cell !== 0 ? cell : ""}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Game;
