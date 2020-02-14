import socket from 'socket.io';

const emitToRoom = () => {};
const broadcastToRoom = () => {};
const emitToSocket = () => {};

function IO (server) {
  const io = socket(server);
  io.origins('*:*');
  const users = {};
  const rooms = {};
  io.on(CONNECTION, async socket => {
    //for each CLIENT-SIDE EMIT..
      socket
        .on(DISCONNECT, async () => { this.disconnect() })
        .on(USER.LOGIN, async () => { this.login() })
        .on(USER.LOGOUT, async () => { this.login() })
        .on(ROOM.ENTER, async data => { this.roomEnter() })
        .on(ROOM.EXIT, async data => { this.roomExit() })
  });

}
IO.prototype.disconnect () {

}
IO.prototype.login () {}
IO.prototype.logout () {}
IO.prototype.roomEnter () {}
IO.prototype.roomExit () {}
IO.prototype.userUpdateInfo () {}
IO.prototype.chat () {}
IO.prototype.login () {}
