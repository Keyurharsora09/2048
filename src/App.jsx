import { useEffect, useState } from "react";
import "./App.css";
import GameBoard from "./components/GameBoard";
import Game from "./components/Game";

function App() {

  return (
    <>
      <h1 className="title">2048 Game</h1>
      <div className="container">
        <GameBoard />
        {/* <Game /> */}
      </div>
    </>
  );
}

export default App;
