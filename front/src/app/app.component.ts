import { Component } from '@angular/core';
import { VoteService } from './services/vote.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front';

  constructor(private voteService: VoteService){

  }

  clickCreateRoom(){
    this.voteService.createRoom(() => {
      console.log("Room created");
    })
  }

  clickCreateVote(){
    this.voteService.createVote(() => {
      console.log("vote created");
    })
  }
}
