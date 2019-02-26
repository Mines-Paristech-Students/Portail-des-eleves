import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Theme, Topic, MessageForum} from "../../models/forum";
import { MarkdownService } from 'ngx-markdown';
import { EditorInstance, EditorOption } from 'angular-markdown-editor';

@Component({
  selector: 'app-view-topic',
  templateUrl: './view-topic.component.html',
  styleUrls: ['./view-topic.component.scss']
})
export class ViewTopicComponent implements OnInit {
	p = 0; //Current page

	topic_id: string;
	topic: Topic;
    list_messages: [MessageForum] ;

    error: any ;

	answer_message: any;
	editorOptions: any;
	answer_message_editor: EditorInstance;

    constructor(private api: ApiService,
				private route: ActivatedRoute,
				private router: Router,
				private markdownService: MarkdownService){}

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
				console.log(this.list_messages.length);
				if(Number(this.list_messages.length) == 0)
				{
					this.router.navigate(['forum']);
				}
			},
            error => {
                this.error = error;
                console.log(error);
            }
		);
    }

	save(){
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
        )
    }

}
