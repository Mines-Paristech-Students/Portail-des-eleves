import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Topic, MessageForum} from "../../models/forum";
import {MarkdownService} from 'ngx-markdown';
import {EditorInstance} from 'angular-markdown-editor';

@Component({
    selector: 'app-view-topic',
    templateUrl: './view-topic.component.html',
    styleUrls: ['./view-topic.component.scss']
})
export class ViewTopicComponent implements OnInit {
    p = 0; //Current page

    topic_id: string;
    topic: Topic;
    list_messages: [MessageForum];
    first_message: MessageForum;
    order: string;

    error: any;

    answer_message: any;
    editorOptions: any;
    answer_message_editor: EditorInstance;

    constructor(private api: ApiService,
                private route: ActivatedRoute,
                private router: Router,
                private markdownService: MarkdownService) {
    }

    ngOnInit() {
        this.topic = new Topic();

        this.route.params.subscribe(
            (params) => {
                this.topic_id = params['topic'];
                this.customInit();
            });

        this.editorOptions = {
            onShow: (e) => this.answer_message_editor = e,
            parser: (val) => this.markdownService.compile(val.trim())
        };
    }

    customInit() {
        this.api.get<Topic>("theme/" + this.topic_id + "/").subscribe(
            data => {
                this.topic = new Topic();
                Object.assign(this.topic, data);
            },
            error => {
                this.error = error;
                console.log(error);
            }
        );

        this.api.get<[MessageForum]>("topic/?topic=" + this.topic_id).subscribe(
            data => {
                this.list_messages = data;
                if (Number(this.list_messages.length) == 0) {
                    this.router.navigate(['forum']);
                }

                this.first_message = this.list_messages[0];
            },
            error => {
                this.error = error;
                console.log(error);
            }
        );
    }

    change_order(new_order) {
        this.order = new_order;
        this.sort_messages();
    }

    sort_messages() {
        if (this.order == "date") {
            this.sort_messages_by_date();
        } else if (this.order == "ratio") {
            this.sort_messages_by_ratio();
        }
    }

    sort_messages_by_ratio() {
        this.list_messages.sort(function (a, b) {
            return parseInt(b.ratio, 10) - parseInt(a.ratio, 10);
        });
    }

    sort_messages_by_date() {
        this.list_messages.sort(function (a, b) {
            return parseInt(a.id, 10) - parseInt(b.id, 10);
        });
    }

    save() {
        this.api.post("topic/", {
            message: this.answer_message,
            topic: this.topic.id
        }).subscribe(
            data => {
                let message = new MessageForum();
                Object.assign(message, data);
                this.list_messages.push(message);
                this.answer_message_editor.setContent("");
            },
            err => this.error = err.message
        );
    }

    new_vote(message, vote) {
        const old_vote = message.my_vote;
        message.my_vote = vote;
        message.ratio += (-old_vote + vote);

        this.api.put("message-forum-vote/", {
            message_id: message.id,
            new_vote: vote
        }).subscribe(
            data => this.sort_messages(),
            err => this.error = err.message
        );
    }

}