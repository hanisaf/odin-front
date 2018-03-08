import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Data} from './data';

@Injectable()
export class MessageService {
  messages: string[] = [];
  constructor(public snackBar: MatSnackBar) {  }
  add(message: string) {
    this.messages.push(message);
    console.log(message);
    this.openSnackBar(message, "OK");
  }

  clear() {
    this.messages = [];
  }
  
  private process(message: any, caller? : string) {
    let msg : string;
    if(caller) {
      msg =  caller + ": " + JSON.stringify(message);
    } else {
      msg = JSON.stringify(message);
    }
    this.messages.push(msg);
    return msg;
  }

  log(message: any, caller? : string) {
    let msg : string = this.process(message, caller);
    console.log(msg);
  }

  info(message: any, caller? : string) {
    this.log(message, caller);
    this.openSnackBar(message, "OK");
  }

  error(message: any, caller? : string) {
    let msg : string = this.process(message, caller);
    console.error(msg);
    this.openSnackBar("ERROR: " + message, "GOT IT!");
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}