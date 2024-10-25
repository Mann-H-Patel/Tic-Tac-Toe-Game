let boxes = document.querySelectorAll(".box");
let reset = document.getElementById("reset");
let newGameBtn = document.getElementById("new-game");
let msgBox = document.querySelector(".msg-box");
let msg = document.getElementById("msg");
let gameModeSelection = document.getElementById("game-mode-selection");

let turnX = true; // true if X's turn, false if O's turn
let count = 0; // Move counter
let mode = ""; // Store game mode
let gameState = ["", "", "", "", "", "", "", "", ""]; // Track game state

let winningPossibility = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

// Function to start a new game
const resetGame = () => {
    turnX = true;
    count = 0;
    gameState = ["", "", "", "", "", "", "", "", ""]; // Reset game state
    enablebox();
    msgBox.classList.add("hide");
    reset.classList.add("hide");
};

// Function to disable boxes
const disablebox = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

// Function to enable boxes
const enablebox = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
};

// Check for a draw
const gameDraw = () => {
    msg.innerText = `Game was a Draw.`;
    msgBox.classList.remove("hide");
    disablebox();
};

// Show winner message
const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgBox.classList.remove("hide");
    disablebox();
};

// Check for winner
const checkWinner = () => {
    for (let pattern of winningPossibility) {
        let pos1Val = gameState[pattern[0]];
        let pos2Val = gameState[pattern[1]];
        let pos3Val = gameState[pattern[2]];

        if (pos1Val !== "" && pos1Val === pos2Val && pos1Val === pos3Val) {
            showWinner(pos1Val);
            return true;
        }
    }
    return false; // No winner found
};

// Handle box clicks
// Handle box clicks
// Handle box clicks
boxes.forEach((val, index) => {
    val.addEventListener("click", () => {
        // Player vs Player or Player vs Computer logic
        if (gameState[index] === "") {
            gameState[index] = turnX ? "X" : "O"; // Update game state
            val.innerText = turnX ? "X" : "O"; // Update UI
            val.disabled = true; // Disable the clicked box
            count++; // Increment move counter

            if (checkWinner()) {
                return; // Winner found, exit
            }

            if (count === 9) {
                gameDraw(); // Check for draw
                return;
            }

            turnX = !turnX; // Switch turns

            // If in computer mode and it's O's turn
            if (mode === "computer" && !turnX) {
                computerPlay(); // Let the computer play
            }
        }
    });
});



// Minimax function to determine the best move
const minimax = (board, depth, isMaximizing) => {
    const winner = checkWinnerLogic(board);
    if (winner === "X") return -10; // Player (X) wins
    if (winner === "O") return 10; // Computer (O) wins
    if (board.every(box => box !== "")) return 0; // Draw

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O"; // Computer move
                let score = minimax(board, depth + 1, false);
                board[i] = ""; // Undo move
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X"; // Player move
                let score = minimax(board, depth + 1, true);
                board[i] = ""; // Undo move
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

// Function to check for winner logic (without UI)
const checkWinnerLogic = (board) => {
    for (let pattern of winningPossibility) {
        let pos1Val = board[pattern[0]];
        let pos2Val = board[pattern[1]];
        let pos3Val = board[pattern[2]];

        if (pos1Val !== "" && pos1Val === pos2Val && pos1Val === pos3Val) {
            return pos1Val; // Return the winner
        }
    }
    return null; // No winner yet
};

// Updated computerPlay function
const computerPlay = () => {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            gameState[i] = "O"; // Try this move
            let score = minimax(gameState, 0, false); // Get the score for this move
            gameState[i] = ""; // Undo move

            if (score > bestScore) {
                bestScore = score; // Update best score
                bestMove = i; // Save the best move
            }
        }
    }

    if (bestMove !== null) {
        boxes[bestMove].innerText = "O"; // Make the best move
        boxes[bestMove].disabled = true;
        gameState[bestMove] = "O"; // Update game state
        count++;
        if (checkWinner()) {
            return; // Winner found, exit
        }
        if (count === 9) {
            gameDraw(); // Check for draw
        }
        turnX = true; // Switch turn back to player
    }
};

// Set up game mode
document.getElementById("friend-mode").addEventListener("click", () => {
    mode = "friend";
    gameModeSelection.classList.add("hide");
    reset.classList.remove("hide");
});

document.getElementById("computer-mode").addEventListener("click", () => {
    mode = "computer";
    gameModeSelection.classList.add("hide");
    reset.classList.remove("hide");
});

// Event listeners for reset and new game
newGameBtn.addEventListener("click", resetGame);
reset.addEventListener("click", resetGame);