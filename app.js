const container = document.querySelector(".container");
const gameContainer = document.querySelector(".gameContainer");
const gameInfo = document.querySelector(".gameInfo");

// creation du plateau de jeu
function gameBoard() {
    gameContainer.innerHTML = "";
    const board = [];
    for (let i = 0; i < 3; i++) {
        const row = [];
        for (let j = 0; j < 3; j++) {
            const box = document.createElement("div");
            box.classList.add("box");
            box.setAttribute("data-row", i);
            box.setAttribute("data-col", j);
            gameContainer.appendChild(box);
            row.push(box);
        }
        board.push(row);
    }
    return board;
}


// gameController creation
function gameController(
    playerOneName = "Player 1",
    playerTwoName = "Player 2"
) {
    const board = gameBoard();

    const players = [
        {
            name: playerOneName,
            symbol: "❌"
        },
        {
            name: playerTwoName,
            symbol: "⭕️"
        }
    ];

    const playerInfo = document.querySelector(".playerInfo");
    playerInfo.textContent = `${players[0].name} (${players[0].symbol}) VS ${players[1].name} (${players[1].symbol})`;

    let currentPlayer = players[0];

    const changePlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }

    const getCurrentPlayer = () => currentPlayer;
    const playerTurn = () => `C'est au tour du ${currentPlayer.name} de jouer`;

    const boardSituation = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];


    function checkWinner(board) {
        // Vérification des lignes
        for (let i = 0; i < 3; i++) {
            if (board[i][0] !== "" && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                return board[i][0];
            }
        }

        // Vérification des colonnes
        for (let j = 0; j < 3; j++) {
            if (board[0][j] !== "" && board[0][j] === board[1][j] && board[1][j] === board[2][j]) {
                return board[0][j];
            }
        }

        // Vérification des diagonales
        if (board[0][0] !== "" && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            return board[0][0];
        }
        if (board[0][2] !== "" && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            return board[0][2];
        }

        // Aucun gagnant
        return null;
    }

    function checkDraw(board) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {
                    return false;
                }
            }
        }
        return true;
    }

    function getWinner(board) {
        const winner = checkWinner(board);
        if (winner) {
            for (const player of players) {
                if (player.symbol === winner) {
                    return player.name + " a gagné";
                }
            }
        }
        if (checkDraw(board)) {
            return "It's a draw";
        }
        return null;
    }

    function resetGame() {

        // Effacer le contenu de toutes les cases
        endGame('reset');
        const boxes = document.querySelectorAll(".box");
        boxes.forEach(box => {
            box.textContent = "";
        });

        // Réinitialiser le tableau de situation du plateau de jeu
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                boardSituation[i][j] = "";
            }
        }

        // Réinitialiser le joueur actuel
        currentPlayer = players[0];

    }


    function endGame(winner) {
        // Supprimez l'overlay existant s'il y en a un
        const existingOverlay = document.querySelector('.overlay');
        if (winner === 'reset' && existingOverlay) {
            container.removeChild(existingOverlay);
        }else if (winner !== 'reset' && !existingOverlay) {
            // Créez un nouvel overlay avec le vainqueur et les boutons "Reset" et "Main Menu"
            const overlay = document.createElement('div');
            overlay.classList.add('overlay');
            const winnerMessage = document.createElement('h1');
            winnerMessage.textContent = winner;
            const resetButton2 = document.createElement('button');
            resetButton2.textContent = "Reset";
            resetButton2.onclick = resetGame;
            const mainMenuButton = document.createElement('button');
            mainMenuButton.textContent = "Main Menu";
            // mainMenuButton.onclick = goToMainMenu;

            overlay.appendChild(winnerMessage);
            overlay.appendChild(resetButton2);
            overlay.appendChild(mainMenuButton);
            container.appendChild(overlay);
        }


    }


    gameInfo.textContent = playerTurn();
    function play(row, col) {
        const box = board[row][col];
        if (box.textContent === "") {
            box.textContent = currentPlayer.symbol;
            boardSituation[row][col] = currentPlayer.symbol;
            const winner = getWinner(boardSituation);
            if (winner) {
                setTimeout(() => {
                    endGame(winner);
                    // gameInfo.textContent = winner;
                    // resetGame(); // Réinitialiser le jeu après un délai
                }, 500); // Attendre 1 seconde avant de réinitialiser le jeu
            } else {
                changePlayer();
                gameInfo.textContent = playerTurn();
            }
        }
    }



    return {play, getCurrentPlayer, playerTurn, boardSituation, getWinner, endGame, resetGame, players, currentPlayer};

}


const game = gameController("Player 1", "Player 2");

// Ajoutez un gestionnaire d'événements de clic pour chaque case.
container.addEventListener("click", function (event) {
    if (event.target.classList.contains("box")) {
        const row = parseInt(event.target.getAttribute("data-row"));
        const col = parseInt(event.target.getAttribute("data-col"));

        // Assurez-vous que la case est vide avant de jouer.
        if (event.target.textContent === "") {
            game.play(row, col);// Jouez le coup dans le contrôleur de jeu.
            //console.log(game.boardSituation);


        }

    } else if (event.target.classList.contains("resetButton")) {
        game.resetGame();

    }
});

