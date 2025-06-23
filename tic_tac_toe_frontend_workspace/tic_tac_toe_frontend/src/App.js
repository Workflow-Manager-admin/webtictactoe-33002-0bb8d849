import React, { useState } from "react";
import "./App.css";

/**
 * Color Palette:
 * --primary:   #1976d2
 * --secondary: #424242
 * --accent:    #ffc107
 * --background: #fafcff
 * --board-border: #e0e6ef
 */

// PUBLIC_INTERFACE
function App() {
  // Game board state: null = empty, 'X', 'O'
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState("");
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });
  const [gameOver, setGameOver] = useState(false);

  // Calculate winner or draw
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
    for (let line of lines) {
      const [a, b, c] = line;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    // Check for draw
    if (squares.every((sq) => sq != null)) return "draw";
    return null;
  }

  // Handle move
  function handleClick(idx) {
    if (board[idx] || gameOver) return;
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? "X" : "O";
    const result = calculateWinner(nextBoard);
    setBoard(nextBoard);

    if (result === "X" || result === "O") {
      setStatus(`Winner: ${result}`);
      setGameOver(true);
      setScores((s) => ({
        ...s,
        [result]: s[result] + 1,
      }));
    } else if (result === "draw") {
      setStatus("Draw!");
      setGameOver(true);
      setScores((s) => ({
        ...s,
        Draws: s.Draws + 1,
      }));
    } else {
      setXIsNext((x) => !x);
      setStatus("");
    }
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    setBoard(Array(9).fill(null));
    setXIsNext((prev) => !prev); // Alternate starting player for fairness
    setGameOver(false);
    setStatus("");
  }

  const player = xIsNext ? "X" : "O";
  const winner = calculateWinner(board);

  // PUBLIC_INTERFACE
  function Square({ value, onClick, highlight }) {
    return (
      <button
        className="ttt-square"
        onClick={onClick}
        style={
          highlight
            ? { background: "var(--accent)", color: "#212121" }
            : undefined
        }
        aria-label={value ? `Cell: ${value}` : "Empty cell"}
      >
        {value}
      </button>
    );
  }

  // Figure out which cells to highlight if there is a win
  function highlightWinner(board) {
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
    for (let line of lines) {
      const [a, b, c] = line;
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return new Set([a, b, c]);
      }
    }
    return new Set();
  }
  const winHighlight = highlightWinner(board);

  return (
    <div
      className="ttt-app"
      style={{
        background: "var(--background, #fafcff)",
        minHeight: "100vh",
        color: "var(--secondary, #424242)",
        fontFamily:
          "Inter, Roboto, 'Helvetica Neue', Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <nav className="navbar" style={{ background: "#fff", borderBottom: "1px solid #e0e6ef" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div className="logo" style={{ color: "var(--primary, #1976d2)" }}>
              <span className="logo-symbol" style={{ color: "#ffc107" }}>●</span>
              Tic Tac Toe
            </div>
            <span className="subtitle" style={{ color: "var(--secondary, #424242)", fontWeight: 500, fontSize: "1rem" }}>
              Minimal React Demo
            </span>
          </div>
        </div>
      </nav>
      <main style={{ flex: 1, paddingTop: 92, paddingBottom: 32, boxSizing: "border-box" }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="ttt-board-container">
            <div className="ttt-status" style={{ marginBottom: 22 }}>
              {winner === "draw" ? (
                <span style={{ color: "#424242", fontWeight: 500 }}>
                  Draw!
                </span>
              ) : winner === "X" || winner === "O" ? (
                <span style={{ color: "var(--primary, #1976d2)", fontWeight: 700 }}>
                  Winner: {winner}
                </span>
              ) : (
                <span style={{ color: "#1976d2" }}>
                  Turn: <span style={{ fontWeight: 600 }}>{player}</span>
                </span>
              )}
            </div>
            {/* Game board */}
            <div className="ttt-board">
              {board.map((cell, idx) => (
                <Square
                  key={idx}
                  value={cell}
                  onClick={() => handleClick(idx)}
                  highlight={winHighlight.has(idx)}
                />
              ))}
            </div>
            <div style={{ marginTop: 28, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <button
                className="ttt-restart-btn"
                onClick={restartGame}
                style={{
                  background: "var(--primary, #1976d2)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 7,
                  padding: "11px 28px",
                  fontWeight: 500,
                  fontSize: 18,
                  cursor: "pointer",
                  marginBottom: 16,
                  letterSpacing: 1,
                  transition: "background 0.15s"
                }}
              >
                Restart Game
              </button>
              {/* Scoreboard */}
              <div className="ttt-scoreboard" style={{
                display: "flex",
                gap: 22,
                borderRadius: 6,
                background: "#f5faff",
                boxShadow: "0 2px 8px 1px rgba(25,118,210,0.07)",
                padding: "12px 24px",
                justifyContent: "center",
                width: "fit-content"
              }}>
                <div style={{ color: "#1976d2", fontWeight: 600, fontSize: 20 }}>X: {scores.X}</div>
                <div style={{ color: "#424242", fontWeight: 600, fontSize: 20 }}>O: {scores.O}</div>
                <div style={{ color: "#ffc107", fontWeight: 600, fontSize: 20 }}>Draws: {scores.Draws}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;