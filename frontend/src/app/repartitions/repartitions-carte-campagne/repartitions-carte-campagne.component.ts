import {Component, Input, OnChanges, OnInit, Output, EventEmitter, SimpleChange} from '@angular/core';
import {ApiService} from "../../api.service";
import {Repartition, Proposition} from "../../models/repartition";

@Component({  
  selector: 'repartitions-carte-campagne',
  templateUrl: './repartitions-carte-campagne.component.html',
  styleUrls: ['./repartitions-carte-campagne.component.scss']
})
export class RepartitionsCarteCampagneComponent implements OnInit, OnChanges {

  @Input() campagne: Repartition
  @Input() displayParameters: any
  @Input() messages: string
  @Output() onSubmitRequested = new EventEmitter<number>();
  @Output() onDeletionRequested = new EventEmitter<number>();
  @Output() onStartRequested = new EventEmitter<number>();

  asAdmin: boolean;
  edit_campagne: Repartition;
  shownMessage: string;

  // state variable
  isEditing: boolean;
  waitingSubmitReply: boolean;
  waitingDeletionReply: boolean;
  waitingStartReply: boolean;
  controlLock: boolean;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.shownMessage = null;
    this.asAdmin = (this.campagne.id == null);
    this.waitingSubmitReply = false;
    this.waitingDeletionReply = false;
    this.waitingStartReply = false;
    this.controlLock = false;
    if(this.campagne.id == null)this.startEditing();
    else this.isEditing = false;
  }

  cancelEdition() {
    if(this.controlLock)return;
    if(this.campagne.id == null)this.deleteCampaign()
    this.isEditing = false;
  }

  startEditing() {
    if(this.controlLock)return;
    this.edit_campagne = this.campagne.clone();
    this.isEditing = true;
  }

  displayMessage(msg: string) {
    this.shownMessage = msg
  }

  clearMessage() {
    this.messages = null;
    this.displayMessage(null)
  }

  submitInput() {
    if(this.controlLock)return;
    this.controlLock = true
    this.clearMessage()
    this.waitingSubmitReply = true
    this.onSubmitRequested.emit(this.campagne.id)
  }

  deleteCampaign() {
    if(this.controlLock)return;
    this.controlLock = true
    this.clearMessage()
    this.waitingDeletionReply = true
    this.onDeletionRequested.emit(this.campagne.id);
  }

  startCampaign() {
    if(this.controlLock)return;
    this.controlLock = true
    this.clearMessage()
    this.waitingStartReply = true
    this.onStartRequested.emit(this.campagne.id);
  }

  terminateAction() {
    if(this.waitingSubmitReply)
    {
      this.edit_campagne = null;
      this.isEditing = false;
    }
    this.clearMessage()
    this.waitingSubmitReply = false;
    this.waitingStartReply = false;
    this.waitingDeletionReply = false;
    this.controlLock = false;
  }

  abortActionWithMessage(msg: string)
  {
    this.displayMessage(msg);
    this.waitingSubmitReply = false;
    this.waitingStartReply = false;
    this.waitingDeletionReply = false;
    this.controlLock = false;
  }

  handleReply(result: boolean, err: string)
  {
    if(result)this.terminateAction();
    else this.abortActionWithMessage(err);
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    console.log("eee")
    for (let propName in changes) {
      console.log(propName)
      console.log(this[propName])
      if(propName == "messages")
      {
        if(changes[propName].isFirstChange())continue;
        if(this.messages == null)continue;
        if(this.messages == "")this.terminateAction()
        else this.abortActionWithMessage(this.messages)
      }
    }
  }
}
