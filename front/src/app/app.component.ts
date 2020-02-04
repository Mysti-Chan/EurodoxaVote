import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front';

  constructor(private socket: Socket){

    this.socket.on("roomJoined", (data) =>{
      console.log(data);
    });

    this.socket.on("noRoom", () =>{
      console.log("no room");
    });

    this.socket.on("RoomAlreadyExist", () =>{
      console.log("RoomAlreadyExist");
    });

    
    this.socket.on("roomCreated", () =>{
      console.log("room created");
    });

    this.socket.on("voteCreated", () =>{
      console.log("vote created");
    });




  }
  clickJoin(){
    this.socket.emit("joinRoom");
  }

  clickCreateRoom(){
    this.socket.emit("createRoom");
  }

  clickCreateVote(){
    this.socket.emit("createVote");
  }
}
