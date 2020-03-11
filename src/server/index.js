import initHttpServer from './http';
import initSocketIO from './socket';

const init = ctx => initHttpServer(ctx).then(initSocketIO);
const config = {port: process.env.PORT || 3001, host: 'localhost'};
init({config});


/*
This connection begins when a user is 'logged in' to the app.
-Entering the site, user is automatically generated a username (is usertype GUEST)
-guests don't have saved games

should there be a master lobby where all logged in people can see games they can enter?
that'd be neat
*/

//Games client's user is subscribed to in ROOMS
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
/*
io.sockets.on('connection', socket => {

  //login prompt (returning user / guest)
  socket.on('login', d => {
    //update client data
    socket.player = d;
    users[d.username] = d;
    console.log(`CLIENT PLAYER: ${JSON.stringify(d)}`);
    // if (d['isGuest'] is TRUE and d['username'] IN CACHE) then ROOMS is also in cache
    //ROOMS = GET ACTIVE GAMES FROM DB

  });

  //saving changes in 'edit profile'
  socket.on('userUpdate', user => {
    socket.user = user;
    socket.username = user.name;

  });

  socket.on('lobbyLoad', () => {
    io.sockets.emit('lobbyLoadSuccess', ROOMS);
  });

  //create new game, then enter
  socket.on('gameCreate', room => {

    ROOMS[room.id] = room;
    console.log(`NEW GAME: ${JSON.stringify(room)}`);
    //UPDATE ROOMS to DB
    io.sockets.emit('lobbyLoadSuccess', ROOMS);
  });

  socket.on('gameEnter', id => {
    console.log(`USER ${JSON.stringify(socket.player)} ENTER GAME: ${id}`);
    ROOMS[id]['users'][socket.player.name] = socket.player;
    if (ROOMS[id].game) console.log(`GAME BOARD: ${JSON.stringify(ROOMS[id].game)}`);
    socket.activeRoomID = id;
    socket.join(id);
    socket.emit('gameLoad', socket.player, ROOMS[id]);
    socket.broadcast.to(id).emit('userActive', socket.player);

  });

  socket.on('gameLeave', id => {
    delete ROOMS[id].users[socket.player.name];
    socket.activeRoom = null;
    socket.broadcast.to(id).emit('userInactive', socket.player.name);

    //If there are any spectators, let them be the new thing or whatever

  });

  socket.on('gameSet', room => {
    ROOMS[socket.activeRoomID] = room;
  });

  socket.on('gameBoardSend', (id, game) => {
    console.log(`DID IT SEND: ${JSON.stringify(game)}`);
    ROOMS[socket.activeRoomID].game = game;
    console.log(`DID IT SEND: ${JSON.stringify(game.player)}`);
    io.in(id).emit('gameBoardRecieve', game);
  });

  // socket.on('gameBoardSet', game => {
  //   ROOMS[socket.activeRoomID].game = game;
  //   ROOMS[socket.activeRoomID].game = game;
  //   socket.broadcast.to(id).emit('gameBoardGet', game);
  // });

  socket.on('chatSend', msg => {
    io.sockets.in(socket.activeRoom.id).emit('chatUpdate', socket.username, msg);
  });

  // socket.on('chatTyping', msg => {
  //   io.sockets.in(socket.activeRoom.id).emit('chatUpdate', socket.username, msg);
  // });

  socket.on('disconnect', () => {

  });

});

*/
//const getAPIandEmit = "TODO";
