const main = () => {
  let rows = [];
  let currentTurn = null;
  const initForm = () => {
    const formDom = document.getElementById("map-initializer-form");
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
      }
    });
    
    //restart 버튼 클릭 시 restartGame 함수 실행
    const restartDom = document.getElementById("restart-button");
    restartDom.addEventListener("click", function () {
      const width = formDom.querySelector('[name="width"]').value;
      const height = formDom.querySelector('[name="height"]').value;
      const turn = formDom.querySelector("[name=stone]").value;
      restartGame(width, height, turn);
    });
  };
    //restartGame 함수
  const restartGame = (width, height, turn) => {
    rows = createMap(width, height);
    startGame(turn);
    resetTime();
  };

  const createMap = (width, height) => {
    const _cells = [];
    const mapDom = document.getElementById("map");
    mapDom.innerHTML = "";
    for (let i = 0; i < height; i++) {
      const row = [];
      const rowDom = document.createElement("div");
      rowDom.className = "row";
      for (let j = 0; j < width; j++) {
        const cellDom = document.createElement("div");
        cellDom.className = "cell";
        // cellDom.textContent = `${i}${j}`;
        rowDom.appendChild(cellDom);
        const cell = {
          x: j,
          y: i,
          dom: cellDom,
          stone: null,
        };

        mapDom.appendChild(rowDom);
        row.push(cell);
      }
      _cells.push(row);
    }
    console.log(_cells);
    return _cells;
  };

  const startGame = (turn) => {
    let count = 0;
    currentTurn = turn;
    rows.forEach((row) => {
      row.forEach((cell) => {
        cell.dom.addEventListener("click", function () {
        // 첫 착수 시 타이머 시작
          count++;
          if (count === 1) startTime();
          cell.stone = currentTurn;
          // 착수
          if (!cell.dom.textContent) {
            if (currentTurn === "black") {
              cell.dom.textContent = "●";
              currentTurn = "white";
            } else {
              cell.dom.textContent = "○";
              currentTurn = "black";
            }
            //착수 취소
          } else {
            //black돌 놓은 순간 바로 currentTurn이 white로 바뀜
            if (currentTurn === "white") {
              cell.dom.textContent = "";
              currentTurn = "black";
            } else {
              cell.dom.textContent = "";
              currentTurn = "white";
            }
          }

          if (checkGameEnd(cell)) {
            gameEnd();
          }
        });
      });
    });
  };

  const checkGameEnd = (cell) => {
    //가로 검사
    //세로 검사
    //대각1 검사
    //대각2 검사
    return false;
  };
  const gameEnd = () => {
    // 게임 종료 처리.
  };

  initForm();
};

//타이머 진행
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
