<template>
  <div class="messages">
    <h1>Server Messages:</h1>
    <ul id="server-messages">
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
      this.messages.push(data);
      console.log(data);
    },
    broadcast: function(data) {
      this.messages.push(data);
      //console.log(data)
    }
  },
  data: function() {
    return {
      messages: []
    };
  }
};
</script>

<style scoped></style>
