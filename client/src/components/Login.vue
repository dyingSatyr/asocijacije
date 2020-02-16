<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div id="loginform" v-if="!loggedIn">
      <input type="text" name="username" v-model="username" id="username" />
      <input type="password" name="password" v-model="password" id="password" />
      <button @click="login">Login</button>
    </div>
    <div id="logout" v-else>
      <p></p>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  sockets: {
    connect: function() {
      console.log("Connected to server.");
    },
    loginResponse: function(data) {
      if (!data.error) {
        this.loggedIn = true;
      } else {
        this.errorMessage = data.message;
      }
    },
    logoutResponse: function(data) {
      if (!data.error) {
        this.loggedIn = false;
      }
    }
  },
  props: {
    msg: String
  },
  data: function() {
    return {
      username: "",
      password: "",
      loggedIn: false,
      errorMessage: ""
    };
  },
  methods: {
    login() {
      // Emit provided info
      this.$socket.emit("login", {
        username: this.username,
        password: this.password
      });
      // Clear inputs
      (this.username = ""), (this.password = "");
    },
    logout() {
      // Emit logout request
      this.$socket.emit("logout");
    }
  }
};
</script>
<style scoped></style>
