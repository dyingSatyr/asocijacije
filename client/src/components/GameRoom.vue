<template>
  <div id="gameroom" v-if="gameOn">
    <h1>Game room {{roomId}}</h1>
    <p>Opponent: {{opponent.username}}</p>
    <button @click="skockoCombination">Send Combination</button>
  </div>
</template>

<script>
export default {
  name: "GameRoom",
  sockets: {
    connect: function() {
      console.log("Connected to server.");
    },
    gameInit: function(data) {
      this.roomId = data.roomId;
      this.opponent = data.opponent;
    },
    //To room
    gameRoomInit: function(data) {
      this.gameOn = true;
      console.log(data.message);
    },
    skockoResult: function(data) {
      console.log(data.message);
    }
  },
  data: function() {
    return {
      gameOn: false,
      roomId: null,
      opponent: null
    };
  },
  methods: {
    skockoCombination() {
      this.$socket.emit(this.roomId, {
        combination: ["skocko", "tref", "pik", "herc"],
        roomId: this.roomId
      });
    }
  }
};
</script>
<style scoped></style>
