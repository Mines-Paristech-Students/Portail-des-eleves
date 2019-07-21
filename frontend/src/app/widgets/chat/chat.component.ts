import { Component, OnInit } from '@angular/core';
import { AbstractWidget } from '../abstractwidget.component';
import { ApiService } from '../../api.service';
import { HttpParams } from '@angular/common/http';
import { RequestCacheService} from '../../request-cache.service'

import { interval, fromEvent } from 'rxjs';
import { delay, finalize } from 'rxjs/operators'

@Component({
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class WidgetChatComponent extends AbstractWidget implements OnInit {

    messages : {'author': string, 'content': string, 'time': string}[]; // Array of chat messages displayed
    messageToSend : string; // The content of the input to be sent to the server
    _chatElement : HTMLElement; // A reference to the chat html element (to manipulate the scroll)
    _prevChatHeight : number = 0; // The last height of the chat, when the scroll view expends during initial load this is used to trigger a scroll to bottom
    _oldestMessageId : number = 0; // The id of the oldest message received (used to request for messages older than this one)
    _latestMessageId : number = 0; // The id of the latest message received (used to request for messages newer than this one)
    _isLoadingOlderMessages : boolean = false; // Is set to false when a request is being made so that we only make one
    _isLoadingNewMessages : boolean = false;
    shouldScrollDown : boolean = true; // The chat must scroll down on load after the initial messages are received. But not when loading older messages
    stopLoadingOlderMessages : boolean = false; // Do not load an infinite amount of messages

    constructor(_apiService: ApiService, _cache: RequestCacheService) {
        super(_apiService, _cache) ;
    }

    ngOnInit() {
        this._chatElement = document.getElementById('chat-scrollable');
        this._apiService.get("chat/retrieve_up_to/", new HttpParams().append('quantity', '20')).subscribe(
            (data:string[]) => {
                if( data.length != 0){
                    this._oldestMessageId = data[0]['id'];
                    this._latestMessageId = data[data.length - 1]['id'];
                    this.messages = data.map((item:any) => {
                        let time = new Date(item['created_at']);
                        return {
                            'author': item['user'],
                            'content': item['message'],
                            'time': ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2) + ":" + ("0" + time.getSeconds()).slice(-2)
                        }
                    })
                } else {
                    this._oldestMessageId = -1;
                    this._latestMessageId = 0;
                    this.messages = []
                }

            },
            err => {console.log(err)},
        );



        fromEvent(this._chatElement, 'scroll').subscribe((_) => {
            if (this._chatElement.scrollTop === 0 && !this._isLoadingOlderMessages && !this.stopLoadingOlderMessages) {
                this._isLoadingOlderMessages = true;
                this.shouldScrollDown = false;
                console.log("Starting request");
                this._apiService.get("chat/retrieve_up_to/", new HttpParams().append('quantity', '10').append('to', this._oldestMessageId.toString())).pipe(
                    delay(1000),
                    finalize(() => {this._isLoadingOlderMessages = false})
                ).subscribe((data:string[]) => {
                    console.log("Request OK");
                    if (data.length){
                        this._oldestMessageId = data[0]['id'];
                        this.messages = data.map((item:any) => {
                            let time = new Date(item['created_at']);
                            return {
                                'author': item['user'],
                                'content': item['message'],
                                'time': ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2) + ":" + ("0" + time.getSeconds()).slice(-2)
                            }
                        }).concat(this.messages);
                        if(this.messages.length > 200){
                            this.stopLoadingOlderMessages = true;
                        }
                    } else {
                        // No message returned, no need to continue loading
                        this.stopLoadingOlderMessages = true;
                    }
                }, err => {console.log(err)})
            }
        });

        interval(5000).subscribe(x => {
            this._update();
        });
    }

    public ngAfterViewChecked(): void {
        /* need _canScrollDown because it triggers even if you enter text in the textarea */
        if (this._canScrollDown()){
            if(this.shouldScrollDown){
                this.scrollDown()
            } else {
                this._chatElement.scrollTop = 5
            }
        }
    }

    private _canScrollDown(): boolean {
        /* compares prev and current scrollHeight */
        const can = (this._prevChatHeight !== this._chatElement.scrollHeight);
        this._prevChatHeight = this._chatElement.scrollHeight;
        return can;
    }

    public scrollDown(): void {
        this._chatElement.scrollTop = this._chatElement.scrollHeight;
    }

    public submitMessage(): void {
        if(this.messageToSend){
            console.log(this.messageToSend);
            this._apiService.post("chat/", {'message': this.messageToSend}).subscribe(
                _ => {this._update()},
                err => {console.log(err)}
            );
            this.messageToSend = ""
        }
    }

    private _update(): void {
        if (this._isLoadingNewMessages){ return }

        this._isLoadingNewMessages = true;
        this._apiService.get("chat/retrieve_from/", new HttpParams().append('from', this._latestMessageId.toString())).pipe(
            finalize(() => {this._isLoadingNewMessages = false})
        ).subscribe(
            (data:string[]) => {
                if(data && data.length){
                    this.shouldScrollDown = true;
                    this._latestMessageId = data[data.length - 1]['id'];
                    this.messages = this.messages.concat(data.map((item:any) => {
                        let time = new Date(item['created_at']);
                        return {
                            'author': item['user'],
                            'content': item['message'],
                            'time': ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2) + ":" + ("0" + time.getSeconds()).slice(-2)
                        }
                    }))
                }
            },
            err => {console.log(err)}
        )
    }

}
