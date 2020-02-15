class StatusInfo {
	constructor() {
		this.playersOnline = 0
	}

	incrementOnlinePlayers() {
		this.playersOnline++
	}

	decrementOnlinePlayers() {
		this.playersOnline--
	}

	get onlinePlayersNumber() {
		return this.playersOnline
	}
}

module.exports = StatusInfo
