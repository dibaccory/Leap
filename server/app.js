import path from 'path';
import express from 'express';
import socket from 'socket.io';
import { createServer } from 'http';

const port = process.env.PORT || 3001;
const server = http.createServer(express());
server.get('/', (req, res) => { res.sendFile(__dirname + '../') });
server.listen(port, () => console.log('Listening on port ${ port }'));
const io = socket(server);
/*
This connection begins when a user is 'logged in' to the app.
-Entering the site, user is automatically generated a username (is usertype GUEST)
-guests don't have saved games

On entering site:
- if cached guest username:
  -adduser (CACHED GUEST USERNAME)
- else
  -adduser (NEW GENERATED GUESTSTRING)

- SHOW ROOMS USER IS IN (connect to db...? look for USERNAME.getRooms())


user commands:

gameCreate: make new room (add room then emit roomEnter)

gameEnter: connect to room

gameLeave: disconnect from room

sendChat: has data {currentRoom, message, chat? idk lol}

updateName:

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


io.sockets.on('connection', socket => {

  //login prompt (returning user / guest)
  socket.on('login', d => {
    //update client data
    socket.username = d.username;
    // if (d['isGuest'] is TRUE and d['username'] IN CACHE) then clientGames is also in cache
    //socket.clientGames = GET ACTIVE GAMES FROM DB

  });

  //saving changes in 'edit profile'
  socket.on('userUpdate', user => {
    socket.user = user;
    socket.username = user.name;
  });

  //create new game, then enter
  socket.on('gameCreate', game => {
    socket.activeGame = game;
    socket.clientGames[game.id] = game;
    //UPDATE clientGames to DB

    socket.join(game.id);
  });

  socket.on('gameEnter', game => {
    socket.activeGame = game;
    socket.broadcast.to(game.id).emit('userActive', socket.username);
  });

  socket.on('gameLeave', game => {
    socket.activeGame = null;
    socket.broadcast.to(game.id).emit('userInactive', socket.username);

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
