const main = () => {
  let playerStatus = 0; // 시작 전
  let rows = [];
  let currentTurn = null;
  const formDom = document.getElementById("map-initializer-form");
  const scoreBoardDom = document.getElementById("score-board");

  const initForm = () => {
    formDom.addEventListener("submit", function (e) {
      e.preventDefault();
      const width = formDom.querySelector('[name="width"]').value;
      const height = formDom.querySelector('[name="height"]').value;
      const turn = formDom.querySelector("[name=stone]").value;
      if (width < 10 || height < 10 || width > 19 || height > 19) {
        alert("10이상, 19이하의 가로 세로를 입력해주세요");
      } else {
        rows = createMap(width, height);
        startGame(turn);
        formDom.classList.add("none");
        scoreBoardDom.classList.remove("none");
      }
    });
  };

  //restartGame 함수
  const restartGame = (width, height, turn) => {
    const resultPanel = document.getElementById("result-panel");
    if (resultPanel) resultPanel.remove();
    rows = createMap(width, height);
    startGame(turn);
    resetTime();
  };

  //restart 버튼 클릭 시 restartGame 함수 실행
  const restartDom = document.getElementById("restart-button");
  restartDom.addEventListener("click", function () {
    playerStatus = 1;
    const width = formDom.querySelector('[name="width"]').value;
    const height = formDom.querySelector('[name="height"]').value;
    const turn = formDom.querySelector("[name=stone]").value;
    restartGame(width, height, turn);
  });

  const createMap = (width, height) => {
    const _cells = [];
    const mapDom = document.getElementById("map");
    mapDom.innerHTML = "";
    for (let i = 0; i < Number(height) + 1; i++) {
      const row = [];
      const rowDom = document.createElement("div");
      rowDom.className = "row";
      if (i === Number(height)) rowDom.classList.add("last-row");
      for (let j = 0; j < Number(width) + 1; j++) {
        const cellDom = document.createElement("div");
        cellDom.className = "cell";
        // cellDom.textContent = `${i}${j}`;
        rowDom.appendChild(cellDom);
        const stoneDom = document.createElement("div");
        stoneDom.className = "stone";
        const cell = {
          x: j,
          y: i,
          dom: cellDom,
          stone: stoneDom,
          turn: null,
        };
        if (j === Number(width)) cellDom.classList.add("last-cell");
        cell.dom.appendChild(stoneDom);
        mapDom.appendChild(rowDom);
        row.push(cell);
      }
      _cells.push(row);
    }
    return _cells;
  };

  const startGame = (turn) => {
    playerStatus = 1; //게임 시작
    let stones = [];
    let count = 0;
    currentTurn = turn;
    rows.forEach((row) => {
      row.forEach((cell) => {
        cell.stone.addEventListener("click", function () {
          if (playerStatus === 1) {
            // 첫 착수 시 타이머 시작
            count++;
            if (count === 1) startTime();
            cell.turn = currentTurn;
            if (checkForbid(cell, currentTurn)) {
              // 착수
              if (!cell.stone.textContent) {
                if (currentTurn === "black") {
                  cell.stone.textContent = "⚫";
                  currentTurn = "white";
                  turn = currentTurn;
                  stones.push(cell);
                } else {
                  cell.stone.textContent = "⚪";
                  currentTurn = "black";
                  turn = currentTurn;
                  stones.push(cell);
                }
                //착수 취소
              } else if (
                cell.x === stones[stones.length - 1].x &&
                cell.y === stones[stones.length - 1].y
              ) {
                //black돌 놓은 순간 바로 currentTurn이 white로 바뀜
                if (currentTurn === "white") {
                  cell.stone.textContent = "";
                  currentTurn = "black";
                  //바둑판 전체 배경 수정
                  cell.turn = null;
                  //history에서 삭제
                  stones.splice(-1, 1);
                } else {
                  cell.stone.textContent = "";
                  currentTurn = "white";
                  //바둑판 전체 배경 수정
                  cell.turn = null;
                  //history에서 삭제
                  stones.splice(-1, 1);
                }
              } else alert("가장 마지막 수부터 취소할 수 있습니다");

              checkGameEnd(cell);

              //놓은 돌들 history
              // console.log(stones);

              //바둑판 전체 배경
              rows[cell.y][cell.x] = cell;
              // console.log(rows);
            } else cell.turn = null;
          }
        });
      });
    });
  };

  //승패 검사
  const checkGameEnd = (cell) => {
    const result = checkRow(cell) || checkColumn(cell) || checkDiagonal(cell);
    if (result) {
      gameEnd(cell);
    }
  };

  //게임 종료
  const gameEnd = (cell) => {
    playerStatus = 2; // 게임 종료
    stopTime();
    let winner;
    const resultPanel = document.createElement("div");
    resultPanel.id = "result-panel";
    cell.turn === "black" ? (winner = "흑돌") : (winner = "백돌");
    resultPanel.innerHTML = "GameOver! " + winner + "의 승리입니다.";
    scoreBoardDom.insertBefore(resultPanel, scoreBoardDom.children[1]);
  };

  initForm();

  //33 검사
  function checkForbid(cell, currentTurn) {
    let forbidden = 0;
    forbidden += checkForbidRow(cell, currentTurn);
    forbidden += checkForbidColumn(cell, currentTurn);
    if (forbidden >= 2) return false;
    forbidden += checkForbidDiagonal(currentTurn);
    if (forbidden >= 2) return false;

    return forbidden < 2;
  }

  //열 33 검사
  function checkForbidRow(cell, currentTurn) {
    const { y } = cell;
    let forbidden = 0;
    for (let cl = 2; cl < rows[y].length - 3; cl++) {
      if (
        currentTurn &&
        rows[y][cl - 2].turn == null &&
        rows[y][cl - 1].turn === currentTurn &&
        rows[y][cl].turn === currentTurn &&
        rows[y][cl + 1].turn === currentTurn &&
        rows[y][cl + 2].turn == null
      ) {
        forbidden++;
        break;
      }
    }
    return forbidden;
  }

  // 행 33 검사
  function checkForbidColumn(cell, currentTurn) {
    const { x } = cell;
    let forbidden = 0;
    for (let rw = 2; rw < rows.length - 3; rw++) {
      if (
        currentTurn &&
        rows[rw - 2][x].turn == null &&
        rows[rw - 1][x].turn === currentTurn &&
        rows[rw][x].turn === currentTurn &&
        rows[rw + 1][x].turn === currentTurn &&
        rows[rw + 2][x].turn == null
      ) {
        forbidden++;
        break;
      }
    }
    return forbidden;
  }

  function checkForbidDiagonal(currentTurn) {
    let forbidden = 0;
    for (let cl = 2; cl < rows[0].length - 3; cl++) {
      for (let rw = 2; rw < rows.length - 3; rw++) {
        if (
          currentTurn &&
          //left 대각선
          rows[rw - 2][cl - 2].turn == null &&
          rows[rw - 1][cl - 1].turn === currentTurn &&
          rows[rw][cl].turn === currentTurn &&
          rows[rw + 1][cl + 1].turn === currentTurn &&
          rows[rw + 2][cl + 2].turn == null
        ) {
          forbidden++;
          console.log("왼쪽 열 3수");
          break;
        }
        if (
          currentTurn &&
          //right 대각선
          rows[rw + 2][cl - 2].turn == null &&
          rows[rw + 1][cl - 1].turn === currentTurn &&
          rows[rw][cl].turn === currentTurn &&
          rows[rw - 1][cl + 1].turn === currentTurn &&
          rows[rw - 2][cl + 2].turn == null
        ) {
          forbidden++;
          console.log("오른쪽 열 3수");
          break;
        }
      }
    }
    return forbidden;
  }
  // 열 승패 검사
  function checkRow(cell) {
    const { y, turn } = cell;
    let result = false;
    for (let cl = 2; cl < rows[y].length - 3; cl++) {
      if (
        turn &&
        rows[y][cl - 2].turn === turn &&
        rows[y][cl - 1].turn === turn &&
        rows[y][cl].turn === turn &&
        rows[y][cl + 1].turn === turn &&
        rows[y][cl + 2].turn === turn
      ) {
        result = true;
        break;
      }
    }
    return result;
  }

  // 행 승패 검사
  function checkColumn(cell) {
    const { x, turn } = cell;
    let result = false;
    for (let rw = 2; rw < rows.length - 3; rw++) {
      if (
        turn &&
        rows[rw - 2][x].turn === turn &&
        rows[rw - 1][x].turn === turn &&
        rows[rw][x].turn === turn &&
        rows[rw + 1][x].turn === turn &&
        rows[rw + 2][x].turn === turn
      ) {
        result = true;
        break;
      }
    }
    return result;
  }

  // 전체 대각선 승패 검사
  function checkDiagonal(cell) {
    const { turn } = cell;
    let result = false;
    for (let cl = 2; cl < rows[0].length - 3; cl++) {
      for (let rw = 2; rw < rows.length - 3; rw++) {
        if (
          turn &&
          //left 대각선
          rows[rw - 2][cl - 2].turn === turn &&
          rows[rw - 1][cl - 1].turn === turn &&
          rows[rw][cl].turn === turn &&
          rows[rw + 1][cl + 1].turn === turn &&
          rows[rw + 2][cl + 2].turn === turn
        ) {
          result = true;
          break;
        }
        if (
          turn &&
          //right 대각선
          rows[rw + 2][cl - 2].turn === turn &&
          rows[rw + 1][cl - 1].turn === turn &&
          rows[rw][cl].turn === turn &&
          rows[rw - 1][cl + 1].turn === turn &&
          rows[rw - 2][cl + 2].turn === turn
        ) {
          result = true;
          break;
        }
      }
    }
    return result;
  }
};

//타이머 진행함수
let time = 0;
let timerId;
const timeRecord = document.getElementById("time-elapsed");
function showTime() {
  time++;
  timeRecord.innerText = timeFormat();
}
function startTime() {
  showTime();
  timerId = setTimeout(startTime, 1000);
}
function stopTime() {
  if (timerId !== null) {
    clearTimeout(timerId);
  }
}
function resetTime() {
  stopTime();
  timeRecord.innerText = "00:00:00";
  time = 0;
}
//타이머 포매팅
let hour, min, sec;
function timeFormat() {
  hour = parseInt(String(time / (60 * 60)));
  min = parseInt(String((time - hour * 60 * 60) / 60));
  sec = time % 60;

  return (
    String(hour).padStart(2, "0") +
    ":" +
    String(min).padStart(2, "0") +
    ":" +
    String(sec).padStart(2, "0")
  );
}

main();
