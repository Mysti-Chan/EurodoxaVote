import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { VoteService } from './services/vote.service';

const config: SocketIoConfig = { url: 'http://localhost:3011', options: {} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule
  ],
  providers: [
    VoteService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
