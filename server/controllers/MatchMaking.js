// Add game controller
const Game = require('./Game')
const uuidv1 = require('uuid')

class MatchMaking {
	constructor(io) {
		this.matchmakingList = []
		this.matches = []
		this.matchmaking = false
		this.io = io
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
	matchmake() {
		while (this.matchmakingList.length > 1) {
			let player1 = this.matchmakingList[0]
			let player2 = this.matchmakingList[1]
			let pair = {
				player1,
				player2
			}
			console.log(`Pair found: ${player1.username} vs ${player2.username}.`)
			// Remove pair from matchmaking array
			this.matchmakingList.splice(0, 2)
			// Add pair to matches array
			this.addMatchedPair(pair)
		}
	}

	// Store found pairs
	addMatchedPair(pair) {
		this.matches.push(pair)
		let gameId = uuidv1()
		console.log(
			`Game ${gameId} is ready to commence: ${pair.player1.username} vs ${pair.player2.username}.`
		)
		let game = new Game(pair, gameId, this.io)
	}

	// Get all matched pairs awaiting player approval
	get matchedPairs() {
		return this.matches
	}

	// Update  approval status

	// On both approved create a room and send clients to room
}

module.exports = MatchMaking
