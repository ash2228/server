const io = require("socket.io")(3002, {
  cors: {
    origin: "*",
    method: ["GET", "POST"]
  },
});

let x = true;
let o = true;
let i = 0;
let peers = 0;

const signAssigner = (peers) => {
  if (peers > 2) {
    console.log("More than 2 players!");
  } else {
    if (x == true) {
      x = false;
      return "X";
    }
    if (o == true) {
      o = false;
      return "O";
    }
  }
};

let players = {
  1: "",
  2: ""
};

io.on("connection", (socket) => {
  if (peers < 2) {
    console.log(`${socket.id} connected`);
    peers++;
    players[peers] = signAssigner(peers); // Modified this line
    socket.emit("sign", players[peers]); // Modified this line
    i = 0;
    socket.on("changeTurn",(turn,e,sig)=>{
      io.emit("TURN",turn);
      console.log(turn)
      io.emit("CHANGE",e,sig)
    })
    socket.on("disconnect", () => {
      console.log(`${socket.id} disconnected`);
      if (players[peers] == "X") { // Modified this line
        x = true;
      }
      if (players[peers] == "O") { // Modified this line
        o = true;
      }
      peers--;
    });
  }
});
