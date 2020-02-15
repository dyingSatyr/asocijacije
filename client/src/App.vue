<template>
	<div id="app">
		<Login msg="Socket.io test" />
		<ServerMessages />
	</div>
</template>

<script>
import Login from './components/Login.vue'
import ServerMessages from './components/ServerMessages.vue'

export default {
	name: 'App',
	components: {
		Login,
		ServerMessages
	}
}
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
