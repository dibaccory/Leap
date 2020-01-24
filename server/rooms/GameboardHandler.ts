import { Room, Client } from 'colyseus';
import { Schema, type, MapSchema } from '@colyseus/schema';

export class Player extends Schema {
  //Set display name, playerSide (playerOne or playerTwo)
}

export class State extends Schema {

}

export class GameboardHandler extends Room<State> {
  //call this when new multiplayer room made
  onCreate () {
    //console.log("new room created: ");
    //this.setState(/*board instance?>*/);
  }

  onJoin (client: Client) {
    console.log(client.id, "joined ChatRoom!");
    //this.state.messages.push(`${ client.id } joined. Say hello!`);
  }

  onMessage (client: Client, data: any) {
    console.log(client.id, "sent message on ChatRoom");
    //this.state.messages.push(`${ client.id }: ${ data }`);
  }

  onLeave (client: Client) {
    console.log(client.id, "left ChatRoom");
    //this.state.messages.push(`${ client.id } left.`);
  }
  onDispose() {
    console.log("dispose this room");
  }
}
