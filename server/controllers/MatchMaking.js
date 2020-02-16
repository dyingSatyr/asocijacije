class MatchMaking {
	constructor() {
		this.matchmakingList = []
		this.matches = []
	}

	// Add player to matchmaking
	addPlayerToMatchmaking(player) {
		this.matchmakingList.push(player)
		console.log(`${player.username} has been added to matchmaking.`)
	}

	// Remove player from matchmaking / cancel
	removePlayerFromMatchmaking(socketId) {
		this.matchmakingList = this.matchmakingList.filter(player => {
			return player.socketId !== socketId
		})
		console.log(`Player has been removed from matchmaking.`)
	}

	get playersCurrentlyMatchmaking() {
		return this.matchmakingList
	}

	// Matchmake

	// Store found pairs / set approval to none

	// Update  approval status

	// On both approved create a room and send clients to room
}

module.exports = MatchMaking
