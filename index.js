"use strict";
console.log("hello");
const tiles_W_H = 50;
const board_size = 500;
const HEIGHT = tiles_W_H;
const WIDTH = tiles_W_H;
const create_game_board = () => [...Array(HEIGHT)].map(() => Array(HEIGHT).fill(0));
let current_board = create_game_board();
let next_board = create_game_board();
const next_button = document.getElementById("next");
if (next_button == null) {
    throw Error("no button is found");
}
const cell_canvas = document.getElementById("cell_canvas");
if (cell_canvas == null) {
    throw Error("no canvas is found");
}
const ctx = cell_canvas.getContext("2d");
if (ctx == null) {
    throw Error("no 2d context is found");
}
ctx.canvas.height = board_size;
ctx.canvas.width = board_size;
const cell_size = ctx.canvas.height / HEIGHT;
const add_point_on_screen = (x, y, current_board) => {
    const cellX = Math.floor(x / cell_size);
    const cellY = Math.floor(y / cell_size);
    current_board[cellY][cellX] = 1;
};
const render_board = (game_board, ctx) => {
    ctx.clearRect(0, 0, board_size, board_size);
    ctx.beginPath();
    for (let c = 0; c < game_board.length; c++) {
        for (let r = 0; r < game_board[c].length; r++) {
            const row = game_board[c][r];
            if (row) {
                ctx.rect(r * cell_size, c * cell_size, cell_size, cell_size);
                ctx.fillStyle = "#fff";
                ctx.fill();
            }
        }
    }
};
const get_n_neighbors = (game_board, x, y) => {
    let neighbors = 0;
    for (let c = -1; c <= 1; c++) {
        for (let r = -1; r <= 1; r++) {
            if (c == 0 && r == 0)
                continue;
            const indexX = x + c;
            const indexY = y + r;
            if (indexX >= 0 && indexX < HEIGHT && indexY >= 0 && indexY < WIDTH) {
                neighbors += game_board[indexX][indexY];
            }
        }
    }
    return neighbors;
};
const calc_next_board = (game_board, next) => {
    for (let c = 0; c < game_board.length; c++) {
        for (let r = 0; r < game_board[c].length; r++) {
            const n_neighbors = get_n_neighbors(game_board, c, r);
            if (game_board[c][r]) {
                if (n_neighbors < 2) {
                    next[c][r] = 0;
                }
                if (n_neighbors == 2 || n_neighbors == 3) {
                    next[c][r] = 1;
                }
                if (n_neighbors > 3) {
                    next[c][r] = 0;
                }
            }
            else {
                if (n_neighbors == 3) {
                    next[c][r] = 1;
                }
            }
        }
    }
};
next_button.addEventListener("click", (e) => {
    calc_next_board(current_board, next_board);
    current_board = structuredClone(next_board);
    render_board(next_board, ctx);
});
cell_canvas.addEventListener("click", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    add_point_on_screen(x, y, current_board);
    render_board(current_board, ctx);
});
render_board(current_board, ctx);
