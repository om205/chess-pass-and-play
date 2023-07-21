class Board {

    constructor() {
        this.board = [];
        this.selected = null;
        this.enPassant = null;
        this.kings = {
            white: null,
            black: null
        };
        this.kingMoved = {
            white: false,
            black: false
        };
        this.rookMoved = {
            white: false,
            black: false
        }
        this.initBoard();
    }

    initBoard() {
        for (let row = 0; row < 8; row++) {
            const rowArr = [];
            for (let col = 0; col < 8; col++) {
                const color = (row + col) % 2 === 0 ? 'black' : 'white';
                const piece = null;
                rowArr.push(new Box(row, col, color, piece));
            }
            this.board.push(rowArr);
        }
        // place knights
        this.board[0][1].piece = new Knight('white', this, this.board[0][1]);
        this.board[0][6].piece = new Knight('white', this, this.board[0][6]);
        this.board[7][1].piece = new Knight('black', this, this.board[7][1]);
        this.board[7][6].piece = new Knight('black', this, this.board[7][6]);

        // place pawns
        for(let col = 0; col < 8; col++)
        {
            this.board[1][col].piece = new Pawn('white', this, this.board[1][col]);
            this.board[6][col].piece = new Pawn('black', this, this.board[6][col]);
        }

        // place bishops
        this.board[0][2].piece = new Bhishop('white', this, this.board[0][2]);
        this.board[0][5].piece = new Bhishop('white', this, this.board[0][5]);
        this.board[7][2].piece = new Bhishop('black', this, this.board[7][2]);
        this.board[7][5].piece = new Bhishop('black', this, this.board[7][5]);

        // place rooks
        this.board[0][0].piece = new Rook('white', this, this.board[0][0]);
        this.board[0][7].piece = new Rook('white', this, this.board[0][7]);
        this.board[7][0].piece = new Rook('black', this, this.board[7][0]);
        this.board[7][7].piece = new Rook('black', this, this.board[7][7]);

        // place queens
        this.board[0][3].piece = new Queen('white', this, this.board[0][3]);
        this.board[7][3].piece = new Queen('black', this, this.board[7][3]);

        // place kings
        this.board[0][4].piece = new King('white', this, this.board[0][4]);
        this.board[7][4].piece = new King('black', this, this.board[7][4]);

        this.kings.white = this.board[0][4].piece;
        this.kings.black = this.board[7][4].piece;
    }

    // additionalMove: {prev: Box, curr: Box, piece: Piece}
    isKingInCheck(color, additionalMove) {
        let row, col;
        if(additionalMove?.piece.type === 'king') {
            row = additionalMove.curr.row;
            col = additionalMove.curr.col;
        }
        else {
            row = this.kings[color]?.box?.row;
            col = this.kings[color]?.box?.col;
        }

        // Returns 1 if there is Attacking piece, 0 if no piece, -1 if out of bounds or friendly piece
        const isAttackingPiece = (row, col, types) => {
            if (!this.isInsideBoard(row, col)) return -1;
            if (additionalMove && row === additionalMove.prev.row && col === additionalMove.prev.col) return 0;
            if (additionalMove && row === additionalMove.curr.row && col === additionalMove.curr.col) 
            {
                if (additionalMove.piece.color === color) return -1;
                if (types.includes(additionalMove.piece.type)) return 1;
                return -1;
            }
            if (this.board[row][col].piece == null) return 0;
            if (this.board[row][col].piece.color === color) return -1;
            if (types.includes(this.board[row][col].piece?.type)) return 1;
            return -1;
        }

        const isAttackingPieceInLine = (row, col, rowInc, colInc, types) => {
            let i = row + rowInc;
            let j = col + colInc;
            while (this.isInsideBoard(i, j)) {
                if (this.board[i][j].piece != null) {   
                    if (this.board[i][j].piece.color != color) {
                        if (types.includes(this.board[i][j].piece.type)) return 1;
                    }
                    break;
                }
                i += rowInc;
                j += colInc;
            }
            return 0;
        }

        // check for pawn attacks
        if (color === 'white') {
            if (isAttackingPiece(row + 1, col - 1, ['pawn']) === 1) return true;
            if (isAttackingPiece(row + 1, col + 1, ['pawn']) === 1) return true;
        } else {
            if (isAttackingPiece(row - 1, col - 1, ['pawn']) === 1) return true;
            if (isAttackingPiece(row - 1, col + 1, ['pawn']) === 1) return true;
        }

        // check for king attacks
        if (isAttackingPiece(row - 1, col - 1, ['king']) === 1) return true;
        if (isAttackingPiece(row - 1, col, ['king']) === 1) return true;
        if (isAttackingPiece(row - 1, col + 1, ['king']) === 1) return true;
        if (isAttackingPiece(row, col - 1, ['king']) === 1) return true;
        if (isAttackingPiece(row, col + 1, ['king']) === 1) return true;
        if (isAttackingPiece(row + 1, col - 1, ['king']) === 1) return true;
        if (isAttackingPiece(row + 1, col, ['king']) === 1) return true;
        if (isAttackingPiece(row + 1, col + 1, ['king']) === 1) return true;


        // check for knight attacks
        if (isAttackingPiece(row - 2, col - 1, ['knight']) === 1) return true;
        if (isAttackingPiece(row - 2, col + 1, ['knight']) === 1) return true;
        if (isAttackingPiece(row - 1, col - 2, ['knight']) === 1) return true;
        if (isAttackingPiece(row - 1, col + 2, ['knight']) === 1) return true;
        if (isAttackingPiece(row + 2, col - 1, ['knight']) === 1) return true;
        if (isAttackingPiece(row + 2, col + 1, ['knight']) === 1) return true;
        if (isAttackingPiece(row + 1, col - 2, ['knight']) === 1) return true;
        if (isAttackingPiece(row + 1, col + 2, ['knight']) === 1) return true;

        // check for diagonal attacks
        for (let i = 1; i < 8; i++) {
            const response = isAttackingPiece(row - i, col - i, ['bishop', 'queen']);
            if(response === 1) return true;
            if(response === -1) break;
        }
        for (let i = 1; i < 8; i++) {
            const response = isAttackingPiece(row - i, col + i, ['bishop', 'queen']);
            if(response === 1) return true;
            if(response === -1) break;
        }
        for (let i = 1; i < 8; i++) {
            const response = isAttackingPiece(row + i, col - i, ['bishop', 'queen']);
            if(response === 1) return true;
            if(response === -1) break;
        }
        for (let i = 1; i < 8; i++) {
            const response = isAttackingPiece(row + i, col + i, ['bishop', 'queen']);
            if(response === 1) return true;
            if(response === -1) break;
        }
        
        // check for horizontal/vertical attacks
        for (let i = 1; i < 8; i++) {
            const response = isAttackingPiece(row - i, col, ['rook', 'queen']);
            if(response === 1) return true;
            if(response === -1) break;
        }
        for (let i = 1; i < 8; i++) {
            const response = isAttackingPiece(row + i, col, ['rook', 'queen']);
            if(response === 1) return true;
            if(response === -1) break;
        }
        for (let i = 1; i < 8; i++) {
            const response = isAttackingPiece(row, col - i, ['rook', 'queen']);
            if(response === 1) return true;
            if(response === -1) break;
        }
        for (let i = 1; i < 8; i++) {
            const response = isAttackingPiece(row, col + i, ['rook', 'queen']);
            if(response === 1) return true;
            if(response === -1) break;
        }

        return false;
    }

    isInsideBoard(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    handleCapture(taken, from) {
        audio.capture.play();
    }

    promote(pawn, type) {
        const newPiece = new Queen(pawn.color, this, pawn.box);
        pawn.box.piece = newPiece;
        audio.promote.play();
    }

    checkmate(color) {
        audio.checkmate.play();
    }
}

class Box {
    constructor(row, col, color, piece) {
        this.row = row;
        this.col = col;
        this.color = color;
        this.piece = piece;
    }
}

class Piece {
    constructor(color, type, board, box) {
        this.color = color;
        this.type = type;
        this.board = board;
        this.box = box;
        this.moves = [];
    }

    isValidMove(row, col) {
        if (!this.board.isInsideBoard(row, col)) return false;
        if (this.board.board[row][col].piece != null && this.board.board[row][col].piece?.color === this.color) return false;
        if(this.board.isKingInCheck(this.color, {prev: this.box, curr: this.board.board[row][col], piece: this})) return false;
        console.log('valid move', row, col)
        return true;
    }

    checkValidMovesInLine(row, col, rowInc, colInc) {
        let i = row + rowInc;
        let j = col + colInc;
        while (this.isValidMove(i, j)) {
            this.moves.push(this.board.board[i][j]);
            if (this.board.board[i][j].piece != null) break;
            i += rowInc;
            j += colInc;
        }
    }

    // checkAttackInLine(row, col, rowInc, colInc) {
    //     let i = row + rowInc;
    //     let j = col + colInc;
    //     while (this.isInsideBoard(i, j)) {
    //         if (this.board.board[i][j].piece != null) {
    //             if (this.board.board[i][j].piece.color != this.color) {
    //                 this.moves.push(this.board.board[i][j]);
    //             }
    //             break;
    //         }
    //         i += rowInc;
    //         j += colInc;
    //     }
    // }

    move(row, col) {
        row = parseInt(row);
        col = parseInt(col);
        if (this.isValidMove(row, col)) {
            console.log(`moving to ${row} ${col}`, this.box)
            if(this.board.board[row][col].piece) this.board.handleCapture(this.board.board[row][col].piece, this.box);
            if(this.type === 'king') this.board.kingMoved[this.color] = true;
            this.box.piece = null;
            this.box = this.board.board[row][col];
            this.box.piece = this;
            this.moves = [];
            if(this.type === 'pawn' && row === 0 && this.color === 'black') 
            {   
                console.log('promoting black pawn')
                this.board.promote(this, this.board.board[row][col], 'queen');
            }
            if(this.type === 'pawn' && row === 7 && this.color === 'white')
            {
                console.log('promoting white pawn')
                this.board.promote(this, this.board.board[row][col], 'queen');
            }
            console.log('moved', this.box, this.type, this.color, row)
            audio.move.play();
            const opponent = this.color === 'white' ? 'black' : 'white';
            if(this.board.isKingInCheck(opponent)) 
            {
                if(this.board.kings[opponent].moves.length)
                audio.check.play();
                else {
                    this.board.checkmate(opponent);
                    return -1;
                }
            }
            return true;
        } return false;
    }
}

class Knight extends Piece {
    constructor(color, board, box) {
        super(color, 'knight', board, box);
    }

    getMoves() {
        const row = this.box.row;
        const col = this.box.col;
        this.moves = [];
        this.isValidMove(row - 2, col - 1) && this.moves.push(this.board.board[row - 2][col - 1]);
        this.isValidMove(row - 2, col + 1) && this.moves.push(this.board.board[row - 2][col + 1]);
        this.isValidMove(row - 1, col - 2) && this.moves.push(this.board.board[row - 1][col - 2]);
        this.isValidMove(row - 1, col + 2) && this.moves.push(this.board.board[row - 1][col + 2]);
        this.isValidMove(row + 1, col - 2) && this.moves.push(this.board.board[row + 1][col - 2]);
        this.isValidMove(row + 1, col + 2) && this.moves.push(this.board.board[row + 1][col + 2]);
        this.isValidMove(row + 2, col - 1) && this.moves.push(this.board.board[row + 2][col - 1]);
        this.isValidMove(row + 2, col + 1) && this.moves.push(this.board.board[row + 2][col + 1]);
    }
}

class Bhishop extends Piece {
    constructor(color, board, box) {
        super(color, 'bishop', board, box);
    }
    
    getMoves() {
        const row = this.box.row;
        const col = this.box.col;
        this.moves = [];
        this.checkValidMovesInLine(row, col, -1, -1);
        this.checkValidMovesInLine(row, col, -1, 1);
        this.checkValidMovesInLine(row, col, 1, -1);
        this.checkValidMovesInLine(row, col, 1, 1);
    }
}

class Rook extends Piece {
    constructor(color, board, box) {
        super(color, 'rook', board, box);
    }

    getMoves() {
        const row = this.box.row;
        const col = this.box.col;
        this.moves = [];
        this.checkValidMovesInLine(row, col, -1, 0);
        this.checkValidMovesInLine(row, col, 1, 0);
        this.checkValidMovesInLine(row, col, 0, -1);
        this.checkValidMovesInLine(row, col, 0, 1);
    }
}

class Queen extends Piece {
    constructor(color, board, box) {
        super(color, 'queen', board, box);
    }

    getMoves() {
        const row = this.box.row;
        const col = this.box.col;
        this.moves = [];
        this.checkValidMovesInLine(row, col, -1, -1);
        this.checkValidMovesInLine(row, col, -1, 1);
        this.checkValidMovesInLine(row, col, 1, -1);
        this.checkValidMovesInLine(row, col, 1, 1);
        this.checkValidMovesInLine(row, col, -1, 0);
        this.checkValidMovesInLine(row, col, 1, 0);
        this.checkValidMovesInLine(row, col, 0, -1);
        this.checkValidMovesInLine(row, col, 0, 1);
    }
}

class Pawn extends Piece {
    constructor(color, board, box) {
        super(color, 'pawn', board, box);
    }

    getMoves() {
        const row = this.box.row;
        const col = this.box.col;
        this.moves = [];
        if (this.color === 'white') {
            if (this.isValidMove(row + 1, col) && !this.board.board[row+1][col].piece) this.moves.push(this.board.board[row + 1][col]);
            if (this.box.row === 1 && this.isValidMove(row + 2, col) && !this.board.board[row+2][col].piece) this.moves.push(this.board.board[row + 2][col]);
            if (this.isValidMove(row + 1, col - 1) && this.board.board[row + 1][col - 1].piece) this.moves.push(this.board.board[row + 1][col - 1]);
            if (this.isValidMove(row + 1, col + 1) && this.board.board[row + 1][col + 1].piece) this.moves.push(this.board.board[row + 1][col + 1]);
        } else {
            if (this.isValidMove(row - 1, col) && !this.board.board[row-1][col].piece) this.moves.push(this.board.board[row - 1][col]);
            if (this.box.row === 6 && this.isValidMove(row - 2, col) && !this.board.board[row-2][col].piece) this.moves.push(this.board.board[row - 2][col]);
            if (this.isValidMove(row - 1, col - 1) && this.board.board[row - 1][col - 1].piece) this.moves.push(this.board.board[row - 1][col - 1]);
            if (this.isValidMove(row - 1, col + 1) && this.board.board[row - 1][col + 1].piece) this.moves.push(this.board.board[row - 1][col + 1]);
        }
    }    
}

class King extends Piece {
    constructor(color, board, box) {
        super(color, 'king', board, box);
    }

    getMoves() {
        const row = this.box.row;
        const col = this.box.col;
        this.moves = [];
        this.isValidMove(row - 1, col - 1) && this.moves.push(this.board.board[row - 1][col - 1]);
        this.isValidMove(row - 1, col) && this.moves.push(this.board.board[row - 1][col]);
        this.isValidMove(row - 1, col + 1) && this.moves.push(this.board.board[row - 1][col + 1]);
        this.isValidMove(row, col - 1) && this.moves.push(this.board.board[row][col - 1]);
        this.isValidMove(row, col + 1) && this.moves.push(this.board.board[row][col + 1]);
        this.isValidMove(row + 1, col - 1) && this.moves.push(this.board.board[row + 1][col - 1]);
        this.isValidMove(row + 1, col) && this.moves.push(this.board.board[row + 1][col]);
        this.isValidMove(row + 1, col + 1) && this.moves.push(this.board.board[row + 1][col + 1]);
        console.log(this.moves);

        // castling

        // if(!this.board.kingMoved[this.color]) {
        //     if(!this.board.rookMoved[this.color].left) {
        //         if(this.board.board[row][col - 1].piece == null && this.board.board[row][col - 2].piece == null && this.board.board[row][col - 3].piece == null) {
        //             this.moves.push(this.board.board[row][col - 2]);
        //         }
        //     }
        //     if(!this.board.rookMoved[this.color].right) {
        //         if(this.board.board[row][col + 1].piece == null && this.board.board[row][col + 2].piece == null) {
        //             this.moves.push(this.board.board[row][col + 2]);
        //         }
        //     }
        // }
    }
}