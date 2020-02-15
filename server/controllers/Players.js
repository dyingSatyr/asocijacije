class Players {
	constructor() {
		this.players = []
	}

	addPlayer(socketId, username) {
		this.players.push({ socketId, username })
	}

	removePlayer(socketId) {
		this.players = this.players.filter(player => {
			return player.socketId !== socketId
		})
	}

	get playersList() {
		return this.players
	}
}

module.exports = Players
