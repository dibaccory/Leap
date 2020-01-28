//import express from 'express';
const socket = require('socket.io');
const http = require('http');
const express = require('express');

const port = process.env.PORT || 3001;
const app = express();
const router = express.Router();
router.get('/', (req, res) => { res.send({response: 'hurrrr' }) } );
app.use(router);
const server = http.createServer( app );
const io = socket(server);
io.origins('*:*');
server.listen(port, () => console.log(`Listening on port ${ port }`));


/*
This connection begins when a user is 'logged in' to the app.
-Entering the site, user is automatically generated a username (is usertype GUEST)
-guests don't have saved games

should there be a master lobby where all logged in people can see games they can enter?
that'd be neat
*/

//Games client's user is subscribed to in clientGames
/* game = {
    id: reGAWGRGAWFEF,
    whitelist: boolean
    users: {
      [username]: {
        name: ,
        player: -1 | PLAYER_ONE | PLAYER_TWO,
        active: boolean
        icon: 'pic'
      }
  }
}

*/

var users = {};

var clientGames = {};


io.sockets.on('connection', socket => {

  //login prompt (returning user / guest)
  socket.on('login', d => {
    //update client data
    socket.player = d;
    users[d.username] = d;
    console.log(`CLIENT PLAYER: ${JSON.stringify(d)}`);
    // if (d['isGuest'] is TRUE and d['username'] IN CACHE) then clientGames is also in cache
    //clientGames = GET ACTIVE GAMES FROM DB

  });

  //saving changes in 'edit profile'
  socket.on('userUpdate', user => {
    socket.user = user;
    socket.username = user.name;

  });

  socket.on('lobbyLoad', () => {
    io.sockets.emit('lobbyLoadSuccess', clientGames);
  });

  //create new game, then enter
  socket.on('gameCreate', game => {

    clientGames[game.id] = game;
    console.log(`NEW GAME: ${JSON.stringify(game)}`);
    //UPDATE clientGames to DB
    io.sockets.emit('lobbyLoadSuccess', clientGames);
  });

  socket.on('gameEnter', id => {
    clientGames[id].users[socket.player.name] = socket.player;
    //socket.activeGame = clientGames[id];
    socket.join(id);
    socket.emit('sendGame', clientGames[id]);
    socket.broadcast.to(id).emit('userActive', socket.player.name);

  });

  socket.on('gameLeave', id => {
    delete clientGames[id].users[socket.player.name];
    //socket.activeGame = null;
    socket.broadcast.to(id).emit('userInactive', socket.player.name);

    //If there are any spectators, let them be the new thing or whatever

  });

  socket.on('chatSend', msg => {
    io.sockets.in(socket.activeGame.id).emit('chatUpdate', socket.username, msg);
  });

  // socket.on('chatTyping', msg => {
  //   io.sockets.in(socket.activeGame.id).emit('chatUpdate', socket.username, msg);
  // });

  socket.on('disconnect', () => {

  });

});
//const getAPIandEmit = "TODO";
