const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// Add server status info
const StatusInfo = require('./controllers/StatusInfo')
let statusInfo = new StatusInfo()

// Add players controller
const Players = require('./controllers/Players')
let players = new Players()

// Add matchmaking controller
const MatchMaking = require('./controllers/MatchMaking')
let matchmaking = new MatchMaking()

// Add dummy users
let dummyUsers = [
	{
		username: 'user1',
		password: 'user1'
	},
	{
		username: 'user2',
		password: 'user2'
	},
	{
		username: 'user3',
		password: 'user3'
	},
	{
		username: 'user4',
		password: 'user4'
	}
]

// Fire up the server
const server = app.listen(
	port,
	console.log(`Server is now running on port: ${port}.`)
)

// Fire up socket.io on express server
const io = require('socket.io')(server)

// Create an endpoint for the server
app.get('/', (req, res) => {
	res.send(`Game server is up and running.`)
})

io.on('connection', socket => {
	/**
	 * ON CONNECT
	 */
	// Inform player has joined
	console.log(`User with socket id ${socket.id} has joined the server.`)
	// Increment users online
	statusInfo.incrementOnlinePlayers()
	// Broadcast new server status
	broadcastServerInfo()
	// Emit welcome message to connected player
	socket.emit(
		'welcome',
		`You have been connected to the server as ${socket.id}`
	)

	/**
	 *  ON DISCONNECT
	 */
	socket.on('disconnect', reason => {
		//Decrement online players
		statusInfo.decrementOnlinePlayers()
		//Remove user from active players
		players.removePlayer(socket.id)
		// Broadcast new server status
		broadcastServerInfo()
		//Inform player has left
		console.log(`${socket.id} has left the server. Reason: "${reason}"`)
	})

	/**
	 *  ON LOGIN
	 */
	socket.on('login', credentials => {
		if (
			dummyUsers.some(user => {
				return (
					user.username === credentials.username &&
					user.password === credentials.password
				)
			})
		) {
			// Login success - respond to client
			socket.emit('loginResponse', {
				error: false,
				message: 'You are now logged in.',
				loggedIn: true
			})
			console.log(`${credentials.username} has logged in.`)
			// Add player to players list
			players.addPlayer(socket.id, credentials.username)
			// Broadcast logged in players list
			broadcastServerInfo()
		} else {
			console.log(credentials)
			// Login failed, respond to client
			socket.emit('loginResponse', {
				error: true,
				message: 'Invalid Credentials.'
			})
			console.log(`${socket.id} tried to login with invalid credentials.`)
		}
	})

	/**
	 *  ON LOGOUT
	 */
	socket.on('logout', () => {
		// Remove player from players list
		players.removePlayer(socket.id)
		//Inform server
		console.log(`Player with id ${socket.id} has logged out.`)
		//Respond to socket
		socket.emit('logoutResponse', {
			error: false,
			message: 'You have been logged out.'
		})
		//Broadcast new server status
		broadcastServerInfo()
	})

	/**
	 *  ON PLAY / MATCHMAKE
	 */

	socket.on('startMatchmaking', () => {
		// Fetch the user from online users list
		let player = players.getPlayerById(socket.id)

		if (!player) {
			socket.emit('startMatchmakingResponse', {
				error: true,
				message: 'You are not logged in.'
			})
		} else {
			// Add player to matchmaking list
			matchmaking.addPlayerToMatchmaking(player)
			// Respond to player that matchmaking begun
			socket.emit('startMatchmakingResponse', {
				error: false,
				message: 'You are now matchmaking.'
			})
		}
		// Broadcast new status
		broadcastServerInfo()
	})

	/**
	 *  CANCEL MATCHMAKE
	 */
	socket.on('cancelMatchmaking', () => {
		// Remove player from matchmaking list
		matchmaking.removePlayerFromMatchmaking(socket.id)
		// Broadcast new status
		broadcastServerInfo()
		// Send response to client
		socket.emit('cancelMatchmakingResponse', {
			erorr: false,
			message: 'You are no longer matchmaking.'
		})
	})
})

// Broadcast server info
const broadcastServerInfo = () => {
	io.sockets.emit('broadcast', {
		connectedSockets: statusInfo.onlinePlayersNumber,
		playersCount: players.playersCount,
		playersList: players.playersList,
		playersMatchmaking: matchmaking.playersCurrentlyMatchmaking
	})
}
