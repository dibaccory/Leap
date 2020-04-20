import mongoose from 'mongoose';

//  Schemas
const User = new mongoose.Schema({
    username: String,
    password: String
});

const Game = new mongoose.Schema({
  board: Array,
  turn: Number,
  continuedMove: Boolean,
  nPieces: Object,
  moves: Array,

});

const Room = new mongoose.Schema({
  _id: String,
  game: Game,
  whitelist: Boolean,
  users: Array,
  host: String,
  player: {
    one: String,
    two: String,
  },
  queue: Array,
});

const Message = new mongoose.Schema({
    username: String,
    message: String
});

const init = ctx => {
  const { config } = ctx;
  const { port, host } = config;
  mongoose.connect(`mongodb://${host}/Leap`, {useNewUrlParser: true, useUnifiedTopology: true});
  const db = mongoose.connection;

  db.on('error', function () {
    console.log("Mongo Connection Failed! ");
  });
  db.once('connected', function () {
      console.log("Mongo Connected");
  });

};

export default init;
