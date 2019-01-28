import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Theme, Topic, MessageForum} from "../../models/forum";

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

	/*froalaOptions = {
        pluginsEnabled: ["align", "colors", "draggable", "embedly", "emoticons", "entities", "lineBreaker", "link", "lists", "paragraphFormat", "paragraphStyle", "quickInsert", "quote", "save", "table", "url", "wordPaste"],
        //pluginsEnabled: ["align", "colors", "draggable", "embedly", "emoticons", "entities", "file", "image", "imageManager", "lineBreaker", "link", "lists", "paragraphFormat", "paragraphStyle", "quickInsert", "quote", "save", "table", "url", "video", "wordPaste"],
    };*/

    constructor(private api: ApiService, private route: ActivatedRoute, private router: Router){}

    ngOnInit() {
		this.topic = new Topic();

		this.route.params.subscribe(
		(params) => {
			this.topic_id = params['topic'];
			this.customInit();
		});
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
				this.answer_message = "";
            },
            err => this.error = err.message
        )
    }

}
