const Skocko = require("./Skocko");

var gameStates = {};
let skocko = new Skocko();

class Game {
  constructor(players, room, io) {
    this.player1 = players.player1;
    this.player2 = players.player2;
    this.roomId = room;
    this.io = io;
    this.initGame();
  }

  initGame() {
    console.log(`Game "${this.roomId}" inited from class!`);

    //Store game to game state
    gameStates[this.roomId] = {
      gameOver: false,
      players: {
        player1: this.player1,
        player2: this.player2
      },
      globalScore: {
        player1: 0,
        player2: 0
      },
      ongoingGame: "Skocko",
      skocko: {
        turnOfPlayer: 1,
        tryCount: 0,
        goals: {
          player1: skocko.generateCombination(),
          player2: skocko.generateCombination()
        }
      }
    };

    //console.log(gameStates);

    // Inform players that game started
    this.io.to(this.player1.socketId).emit("gameInit", {
      roomId: this.roomId,
      playerNo: 1,
      opponent: this.player2,
      message: "Game initialized."
    });

    this.io.to(this.player2.socketId).emit("gameInit", {
      roomId: this.roomId,
      playerNo: 2,
      opponent: this.player1,
      message: "Game initialized."
    });

    //Push players to room
    this.io.sockets.connected[this.player1.socketId].join(this.roomId);
    this.io.sockets.connected[this.player2.socketId].join(this.roomId);

    //Send message to room
    this.io.to(this.roomId).emit("gameRoomInit", {
      message: "Game Starts Shortly"
    });

    //console.log(this.io);

    //Handle Skocko Combination player 1
    this.io.sockets.connected[this.player1.socketId].on(
      "skockoCombination",
      data => {
        let socket = this.io.sockets.connected[this.player1.socketId];
        let gameId = data.roomId;
        // Handle incorrect room/gameid
        if (gameStates[gameId] === undefined) {
          socket.emit("skockoResult", {
            error: true,
            message: "No game ongoing with that ID."
          });
          return;
        }

        //Check if player turn matches with sender
        let turnOfPlayer = gameStates[gameId].skocko.turnOfPlayer;
        if (turnOfPlayer !== 1) {
          socket.emit("skockoResult", {
            error: true,
            message: "It is not your turn to play."
          });
          return;
        }

        //Handle incorrect combination
        let combination = data.combination;
        if (combination.length !== 4) {
          socket.emit("skockoResult", {
            error: true,
            message: "Combination sent is missing or incomplete."
          });
          return;
        }

        // If all is good check the combination
        let goal;
        if (turnOfPlayer === 1) {
          goal = gameStates[gameId].skocko.goals.player1;
        } else {
          goal = gameStates[gameId].skocko.goals.player2;
        }
        let result = skocko.checkCombination(data.combination, goal);
        let tryNo = ++gameStates[gameId].skocko.tryCount;

        // Inform room on result
        if (result.found) {
          this.io.to(this.roomId).emit("skockoResult", {
            message: `${this.player1.username} has found the combination on ${tryNo} try.`,
            combination: data.combination
          });
          gameStates[gameId].skocko.turnOfPlayer = 2;
        } else {
          this.io.to(this.roomId).emit("skockoResult", {
            message: `${this.player1.username} has ${result.correct} correct and ${result.inPlace} in place. Tries used: ${tryNo}`,
            combination: data.combination,
            correct: result.correct,
            inPlace: result.inPlace,
            tryNo: tryNo
          });
        }

        //if tryNo reached 6 switch active player
        if (tryNo === 6) {
          gameStates[gameId].skocko.turnOfPlayer = 2;
          gameStates[gameId].skocko.tryNo = 0;
        }
      }
    );

    //Handle Skocko Combination player 2
    this.io.sockets.connected[this.player2.socketId].on(
      "skockoCombination",
      data => {
        let socket = this.io.sockets.connected[this.player2.socketId];
        let gameId = data.roomId;
        // Handle incorrect room/gameid
        if (gameStates[gameId] === undefined) {
          socket.emit("skockoResult", {
            error: true,
            message: "No game ongoing with that ID."
          });
          return;
        }

        //Check if player turn matches with sender
        let turnOfPlayer = gameStates[gameId].skocko.turnOfPlayer;
        if (turnOfPlayer !== 2) {
          socket.emit("skockoResult", {
            error: true,
            message: "It is not your turn to play."
          });
          return;
        }

        //Handle incorrect combination
        let combination = data.combination;
        if (combination.length !== 4) {
          socket.emit("skockoResult", {
            error: true,
            message: "Combination sent is missing or incomplete."
          });
          return;
        }

        // If all is good check the combination
        let goal;
        if (turnOfPlayer === 1) {
          goal = gameStates[gameId].skocko.goals.player1;
        } else {
          goal = gameStates[gameId].skocko.goals.player2;
        }
        let result = skocko.checkCombination(data.combination, goal);
        let tryNo = ++gameStates[gameId].skocko.tryCount;

        // Inform room on result
        if (result.found) {
          this.io.to(this.roomId).emit("skockoResult", {
            message: `${this.player2.username} has found the combination on ${tryNo} try.`,
            combination: data.combination
          });
        } else {
          this.io.to(this.roomId).emit("skockoResult", {
            message: `${this.player2.username} has ${result.correct} correct and ${result.inPlace} in place. Tries used: ${tryNo}`,
            combination: data.combination,
            correct: result.correct,
            inPlace: result.inPlace,
            tryNo: tryNo
          });
        }

        //if tryNo reached 6 switch active player
        if (tryNo === 6) {
          gameStates[gameId].skocko.turnOfPlayer = 1;
        }
      }
    );
  }
}

module.exports = Game;
