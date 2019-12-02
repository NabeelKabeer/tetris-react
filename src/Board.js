import React from "react";
import Grid from "./Grid";
import { blockStructure, blocks } from "./Const";
import Next from "./next/Next";
import Score from "./score/Score";
import Level from "./Level";
import "./board.css";
import "./index.css";

function getBlock() {
  const randIndex = Math.floor(Math.random() * 7);
  return blockStructure[blocks[randIndex]];
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    const boardMap = [];
    for (let i = 0; i < 20; i++) boardMap.push(Array(10).fill(0));

    this.state = {
      boardMap: boardMap,
      nextPiece: {
        piece: getBlock()
      },
      currentPiece: {
        piece: getBlock()
      },
      current_i: 0,
      current_j: 0,
      timer: 500,
      score: 0,
      timerId: 0
    };
  }

  getSignificantPiece() {
    const currentPiece = this.state.currentPiece.piece;
    let sig = [];
    for (let j = 0; j < currentPiece[0].length; j++)
      for (let i = currentPiece.length - 1; i >= 0; i--)
        if (currentPiece[i][j]) {
          sig.push(i);
          break;
        }
    return sig;
  }

  getLeftSignificationPiece() {
    const currentPiece = this.state.currentPiece.piece;
    let sig = [];
    for (let i = 0; i < currentPiece.length; i++) {
      for (let j = 0; j < currentPiece[0].length; j++) {
        if (currentPiece[i][j]) {
          sig.push(j);
          break;
        }
      }
    }
    return sig;
  }

  getRightSignificantPiece() {
    const currentPiece = this.state.currentPiece.piece;
    let sig = [];
    for (let i = 0; i < currentPiece.length; i++) {
      for (let j = currentPiece[0].length - 1; j >= 0; j--) {
        if (currentPiece[i][j]) {
          sig.push(j);
          break;
        }
      }
    }
    return sig;
  }
  isInRange(x, y) {
    if (x > -1 && x < 20 && y > -1 && y < 10) return true;
    return false;
  }

  getCurrentBoard() {
    const currentPiece = this.state.currentPiece.piece;
    const boardMap = this.state.boardMap;
    const currentI = this.state.current_i;
    const currentJ = this.state.current_j;

    const currentBoard = [];
    for (let i = 0; i < boardMap.length; i++)
      currentBoard.push(boardMap[i].slice());

    for (let i = 0; i < currentPiece.length; i++)
      for (let j = 0; j < currentPiece[i].length; j++) {
        if (currentPiece[i][j] && i + currentI < 20 && j + currentJ < 10)
          currentBoard[i + currentI][j + currentJ] = currentPiece[i][j];
      }
    return currentBoard;
  }

  collisionOccured() {
    const currentPiece = this.state.currentPiece.piece;
    const currentBoard = this.getCurrentBoard();
    const sigPiece = this.getSignificantPiece();
    const current_i = this.state.current_i;
    const current_j = this.state.current_j;

    if (this.isInRange(current_i + currentPiece.length, current_j)) {
      for (let k = 0; k < sigPiece.length; k++) {
        if (
          currentBoard[current_i + sigPiece[k]][current_j + k] &&
          currentBoard[current_i + sigPiece[k] + 1][current_j + k]
        ) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }

  rotateCurrentPiece() {
    const currentPiece = this.state.currentPiece.piece;
    const n = currentPiece[0].length;
    const m = currentPiece.length;

    let rotatedPiece = {};
    rotatedPiece.piece = [];

    for (let i = 0; i < n; i++) rotatedPiece.piece.push(Array(m).fill(0));

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++)
        rotatedPiece.piece[n - j - 1][i] = currentPiece[i][j];
    }

    this.setState({
      currentPiece: rotatedPiece
    });
  }

  rightBoundaryReached() {
    const currentPiece = this.state.currentPiece.piece;
    const currentBoard = this.getCurrentBoard();
    const rightPiece = this.getRightSignificantPiece();
    let current_i = this.state.current_i;
    let current_j = this.state.current_j;

    //rightmost elements
    if (current_j + currentPiece[0].length >= 10) {
      return true;
    }
    //check if atleast one element to the right is blocking
    for (let k = 0; k < rightPiece.length; k++) {
      if (
        currentBoard[current_i + k][current_j + rightPiece[k]] &&
        currentBoard[current_i + k][current_j + rightPiece[k] + 1]
      )
        return true;
    }
    return false;
  }
  leftBoundaryReached() {
    const currentBoard = this.getCurrentBoard();
    const leftPiece = this.getLeftSignificationPiece();
    let current_i = this.state.current_i;
    let current_j = this.state.current_j;

    //lefmost elements
    if (current_j - 1 < 0) {
      return true;
    }
    //check if atleast one element to the left is blocking
    for (let k = 0; k < leftPiece.length; k++) {
      if (
        currentBoard[current_i + k][current_j + leftPiece[k]] &&
        currentBoard[current_i + k][current_j + leftPiece[k] - 1]
      )
        return true;
    }

    return false;
  }

  renderPiece() {
    const currentBoard = this.getCurrentBoard();
    this.setState({
      boardMap: currentBoard
    });
  }

  cleanUpMap() {
    //check if there is any row with all ones
    const currentBoard = this.state.boardMap;
    let cleanUpRowList = [];

    for (let i = 0; i < currentBoard.length; i++)
      if (
        currentBoard[i].reduce((total, num) => total + num) ===
        currentBoard[i].length
      )
        cleanUpRowList.push(i);
    if (cleanUpRowList.length === 0) return;
    let first_row = Math.min(...cleanUpRowList);
    let last_row = Math.max(...cleanUpRowList);

    //translate every element to this row
    const newMap = [];
    for (let i = 0; i < 20; i++) newMap.push(Array(10).fill(0));

    for (let i = 19; i > last_row; i--) newMap[i] = currentBoard[i].slice();

    for (let i = 0; i < first_row; i++)
      newMap[i + last_row - first_row + 1] = currentBoard[i].slice();

    const scoreAwarded = this.state.score + (last_row - first_row + 1) * 100;

    this.setState({
      boardMap: newMap,
      score: scoreAwarded
    });
  }

  updatePosition() {
    let new_i = this.state.current_i;
    const new_j = this.state.current_j;

    if (this.collisionOccured()) {
      this.renderPiece();
      this.cleanUpMap();
      /**move this into a diffrent location **/
      const newPiece = {};
      newPiece.piece = this.state.nextPiece.piece;
      const futurePiece = {};
      futurePiece.piece = getBlock();
      this.setState({
        current_i: 0,
        current_j: 0,
        currentPiece: newPiece,
        nextPiece: futurePiece
      });
    } else {
      new_i = new_i + 1;

      this.setState({
        current_i: new_i,
        current_j: new_j
      });
    }
  }
  registerMoveUp() {
    const currentJ = this.state.current_j;
    const currentPieceLength = this.state.currentPiece.piece.length;
    if (currentJ + currentPieceLength < 10) {
      this.rotateCurrentPiece();
    }
  }

  registerMoveLeft() {
    let new_j = this.state.current_j;
    if (this.leftBoundaryReached()) {
      return;
    } else {
      new_j = new_j - 1;
      this.setState({
        current_j: new_j
      });
    }
  }
  registerMoveRight() {
    let new_j = this.state.current_j;
    if (this.rightBoundaryReached()) {
      return;
    } else {
      new_j = new_j + 1;
      this.setState({
        current_j: new_j
      });
    }
  }
  registerMoveDown() {
    const current_i = this.state.current_i;
    if (this.collisionOccured()) return;
    let new_i = current_i + 1;
    this.setState({
      current_i: new_i
    });
  }
  registerMove(event) {
    switch (event.key) {
      case "ArrowRight":
        this.registerMoveRight();
        break;
      case "ArrowLeft":
        this.registerMoveLeft();
        break;
      case "ArrowUp":
        this.registerMoveUp();
        break;
      case "ArrowDown":
        this.registerMoveDown();
        break;
      case "p":
        clearInterval(this.state.timerId);
        break;
      case "r":
        this.run();
        break;
      default:
    }
  }
  run() {
    let timerId = setInterval(() => this.updatePosition(), this.state.timer);
    this.setState({
      timerId: timerId
    });
  }
  componentDidMount() {
    window.addEventListener("keydown", this.registerMove.bind(this));
    this.run();
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="item0">
            <h1 className="score">Tetris</h1>
          </div>
          <div className="item1">
            <Grid
              board={this.getCurrentBoard()}
              piece={this.state.currentPiece.piece}
              currentI={this.state.current_i}
              currentJ={this.state.current_j}
            />
          </div>
          <div className="item2">
            <Score score={this.state.score} />
            <Next piece={this.state.nextPiece.piece} />
            <Level />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Board;
