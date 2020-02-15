<template>
	<div class="hello">
		<h1>{{ msg }}</h1>
		<input type="text" name="username" v-model="username" id="username" />
		<input type="password" name="password" v-model="password" id="password" />
		<button @click="login">Login</button>
	</div>
</template>

<script>
export default {
	name: 'Login',
	sockets: {
		connect: function() {
			console.log('Connected to server.')
		}
	},
	props: {
		msg: String
	},
	data: function() {
		return {
			username: '',
			password: ''
		}
	},
	methods: {
		login() {
			this.$socket.emit('login', {
				username: this.username,
				password: this.password
			})
		}
	}
}
</script>
<style scoped></style>
