<template>
  <div>
    <h1>Play</h1>
    <div v-if="!matchmaking">
      <button id="play" @click="startMatchmaking">Play</button>
    </div>
    <div v-else>
      <p>Searching for opponent.</p>
      <button @click="cancelMatchmaking">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MatchMaking",
  sockets: {
    connect: function() {
      console.log("Connected to server.");
    },
    startMatchmakingResponse: function(data) {
      if (!data.error) {
        this.matchmaking = true;
        console.log(data.message);
      } else {
        this.matchmaking = false;
        console.log(data.message);
      }
    },
    cancelMatchmakingResponse: function(data) {
      if (!data.error) {
        this.matchmaking = false;
        console.log(data.message);
      }
    }
  },
  data: function() {
    return {
      matchmaking: false
    };
  },
  methods: {
    startMatchmaking() {
      this.$socket.emit("startMatchmaking");
    },
    cancelMatchmaking() {
      this.$socket.emit("cancelMatchmaking");
    }
  }
};
</script>
<style scoped></style>
