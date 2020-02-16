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

	get playersCount() {
		return this.players.length
	}

	getPlayerById(socketId) {
		let result = this.players.find(player => {
			return player.socketId === socketId
		})
		console.log(result)
		return result
	}
}

module.exports = Players
