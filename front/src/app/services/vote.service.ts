import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { Vote } from "../model/vote.model";
import { VotingInformation } from "../model/votingInformation.model";

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  
  private roomExist: boolean;
  public RoomExistSubject: Subject<boolean>;

  private voteInformation: Vote;
  public voteInformationSubject: Subject<Vote>;

  constructor(private socket: Socket) {
    
    this.RoomExistSubject = new Subject<boolean>();
    this.voteInformationSubject = new Subject<Vote>();
    this.socket.emit('authenticate', {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1ODMxNTgwNjAsImV4cCI6MTU4MzQxNzI2MH0.rZ2HywlPcgBXZ_HR5_f8Sak0tytDjXI4YqHuX-xR-ss"})
    .on('authenticated', () => {
      console.log("paf");
    })
    .on('unauthorized', (msg) => {
      console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
      throw new Error(msg.data.type);
    }) //send the jwt

    this.socket.on("roomNotExist", () =>{
      this.roomExist = false;
      this.emitRoomExist();
    });

    this.socket.on("roomExist", () =>{
      this.roomExist = true;
      this.emitRoomExist();
      this.socket.emit("voteInformation");
    });

    this.socket.on("voteInformation", (data: Vote) =>{
      this.voteInformation = data;
    });

  }

  public emitRoomExist(){
    this.RoomExistSubject.next(this.roomExist);
  }

  public emitvotingInProgress(){
    this.voteInformationSubject.next(Object.assign(new Vote(),this.voteInformation));
  }

  public createRoom(callback: Function){
    this.socket.emit("createRoom", {}, callback);
  }

  public createVote(callback: Function){
    let vote = new Vote();
    vote.description = "description du vote";
    vote.title = "titre du vote"; 
    this.socket.emit("createVote", vote, callback);
  }

  public vote(data:any){
    this.socket.emit("createRoom", data);
  }
}
