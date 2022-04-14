




const main = () => {
    let rows = [];
    let currentTurn = null;
    const initForm = () => {
        const formDom = document.getElementById('map-initializer-form');
        formDom.addEventListener('submit' , function (e) {
            e.preventDefault();
            const width = formDom.querySelector('[name="width"]').value;
            const height = width;

            rows = createMap(width, height);
            startGame('black');
        })
    }

    const createMap = (width, height) => {
        const _cells = [
        ]
        const mapDom = document.getElementById('map');
        mapDom.innerHTML = '';
        for (let i = 0; i <height; i++) {
            const row = [];
            const rowDom = document.createElement('div');
            rowDom.className = 'row';
            for (let j = 0; j <width; j++) {
                const cellDom = document.createElement('div');
                cellDom.className = 'cell';
                //cellDom.textContent = `${i}${j}`;
                rowDom.appendChild(cellDom);
                const cell = {
                    x: j,
                    y: i,
                    dom: cellDom,
                    stone: null,
                }

                mapDom.appendChild(rowDom);
                row.push(cell);
            }
            _cells.push(row);
        }

        return _cells;
    }

    const startGame = (turn) => {
        currentTurn = turn;
        rows.forEach(row => {
            row.forEach(cell => {
                cell.dom.addEventListener('click', function(){
                    cell.stone = currentTurn;
                    if (currentTurn === 'black') {
                        cell.dom.textContent = '●';
                        currentTurn = 'white';
                    } else {
                        cell.dom.textContent = '○';
                        currentTurn = 'black';
                    }

                    if(checkGameEnd(cell)) {
                        gameEnd();
                    }
                })
            })
        });
    }

    const checkGameEnd = (cell) => {
        //가로 검사
        //세로 검사
        //대각1 검사
        //대각2 검사
        return false;
    }
    const gameEnd = () => {
        // 게임 종료 처리.
    }

    initForm();
}

main();