const pieces = {
    king: '&#9812;',
    queen: '&#9813;',
    rook: '&#9814;',
    bishop: '&#9815;',
    knight: '&#9816;',
    pawn: '&#9817;'
}

const audio = {
    move: new Audio('./assets/move-self.mp3'),
    capture: new Audio('./assets/capture.mp3'),
    castle: new Audio('./assets/castle.mp3'),
    check: new Audio('./assets/move-check.mp3'),
    promote: new Audio('./assets/promote.mp3'),
    checkmate: new Audio('./assets/checkmate (2).mp3'),
}

const options = {
    flip: false,
}

class Game {
    constructor() {
        this.canvas = null;
        this.turn = null;
        this.chessBoard = new Board();
        this.handleClick = this.handleClick.bind(this);
        this.init();
    }

    init() {
        this.canvas = document.getElementById('board');
        this.turn = 'white';
        this.render();
        addEventListener('click', this.handleClick);
    }

    render() {
        this.canvas.innerHTML = '';
        const order = options.flip && this.turn === 'black' ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
        order.forEach((rowIndex) => {
            order.forEach((cellIndex) => {
                const box = document.createElement('div');
                box.classList.add('box');
                const cell = this.chessBoard.board[rowIndex][cellIndex];
                if(cell.color === 'black') box.classList.add('dark');
                box.id = `${rowIndex}-${cellIndex}`;
                    if(cell.piece) {
                        const piece = document.createElement('div');
                        piece.classList.add('piece');
                        piece.classList.add(cell.piece.color);
                        piece.classList.add(cell.piece.type);
                        if(cell.piece === this.chessBoard.selected)piece.classList.add('selected');
                        if(cell.piece.color === 'white')piece.classList.add('bordered-text')
                        const pieceIcon = pieces[cell.piece.type];
                        piece.innerHTML = pieceIcon;
                        box.appendChild(piece);
                    }
                    this.canvas.appendChild(box);
            });
        });
        this.chessBoard.selected?.moves?.forEach((box) => {
            const boxElement = document.getElementById(`${box.row}-${box.col}`);
            boxElement.classList.add('possible');
        });
    }

    handleClick(event) {
        console.log('ch1: ',event.target)
        const T = event.target;
        const TC = Array.from(T.classList);
        const PC = Array.from(T.parentElement.classList);
        if(TC.includes('box'))
        {
            console.log('box', TC)
            if(TC.includes('possible')) this.move(T);
            else this.chessBoard.selected = null;
        }
        if(TC.includes('piece'))
        {
            console.log('piece', TC)
            if(PC.includes('possible')) this.move(T.parentElement);
            else this.select(T);
        }
        this.render();
    }

    select(piece) {
        console.log('ch2: ',this.turn === piece.classList[1])
        if(piece.classList[0] !== 'piece' || piece.classList[1] !== this.turn) return false;
        const piecePosition = piece.parentElement.id.split('-');
        const pieceObject = this.chessBoard.board[piecePosition[0]][piecePosition[1]].piece;
        if(!piece) return false;
        this.chessBoard.selected = pieceObject;
        pieceObject.getMoves();
        console.log('ch2: ', pieceObject)
    }

    move(box) {
        console.log('inside move')
        if(this.chessBoard.selected == null) return false;
        const piecePosition = box.id.split('-');
        const pieceObject = this.chessBoard.selected;
        console.log('ch3: ', pieceObject)
        const move = pieceObject.move(piecePosition[0], piecePosition[1])
        if(move === -1) this.gameOver(this.turn, 'checkmate');
        if(move) this.turn = this.turn === 'white' ? 'black' : 'white';
        this.chessBoard.selected = null;
    }

    gameOver(winner, type) {
        this.end();
        console.log('winner ', winner, 'type ', type)
        const gameOver = document.getElementById('result');
        gameOver.style.visibility = 'visible';
        const winnerElement = document.getElementById('winner');
        winnerElement.innerHTML = winner;
        const typeElement = document.getElementById('type');
        typeElement.innerHTML = type;
    }

    end() {
        removeEventListener('click', this.handleClick);
    }

}

let game = new Game();

const resetBtn = document.getElementById('reset');
resetBtn.addEventListener('click', () => {
    document.getElementById('result').style.visibility = 'hidden';
    game.end();
    game = null;
    game = new Game();
})

const flipBtn = document.getElementById('flip');
flipBtn.addEventListener('click', () => {
    options.flip = !options.flip;
    game.render();
})