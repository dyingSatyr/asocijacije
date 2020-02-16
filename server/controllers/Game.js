class Game {
	constructor(players, room, io) {
		this.player1 = players.player1
		this.player2 = players.player2
		this.roomId = room
		this.io = io
		this.initGame()
	}

	initGame() {
		console.log(`Game "${this.roomId}" inited from class!`)

		// Inform players that game started
		this.io.to(this.player1.socketId).emit('gameInit', {
			roomId: this.roomId,
			opponent: this.player2,
			message: 'Game started.'
		})

		this.io.to(this.player2.socketId).emit('gameInit', {
			roomId: this.roomId,
			opponent: this.player1,
			message: 'Game started.'
		})
	}
}

module.exports = Game
