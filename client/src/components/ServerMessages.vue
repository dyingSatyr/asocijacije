<template>
  <div class="messages">
    <ul id="server-messages">
      <h1>Server Messages:</h1>
      <li v-for="(message, index) in messages" :key="index">{{ message }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ServerMessages",
  sockets: {
    connect: function() {
      console.log("Connected to server.");
    },
    welcome: function(data) {
      this.messages.unshift(data);
      console.log(data);
    },
    broadcast: function(data) {
      this.messages.unshift(data);
    }
  },
  data: function() {
    return {
      messages: []
    };
  }
};
</script>

<style scoped>
#server-messages {
  background: #282c34;
  text-align: left;
  padding: 30px;
  list-style: none;
  color: #abb2bf;
  font-size: 13px;
  position: fixed;
  bottom: 0;
  width: 100vw;
  max-height: 300px;
  overflow-y: scroll;
}

#server-messages li {
  padding: 3px;
}
</style>
