import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Theme, Topic, MessageForum} from "../../models/forum";
import {User} from "../../models/user";

@Component({
  selector: 'app-view-theme',
  templateUrl: './view-theme.component.html',
  styleUrls: ['./view-theme.component.scss']
})
export class ViewThemeComponent implements OnInit {
	
	theme_id: string;
	theme: Theme;
    list_topics: [Topic] ;

    error: any ;
	
	user: User;
	
	new_topic: Topic;
	first_message: string;

    froalaOptions = {
        pluginsEnabled: ["align", "colors", "draggable", "embedly", "emoticons", "entities", "lineBreaker", "link", "lists", "paragraphFormat", "paragraphStyle", "quickInsert", "quote", "save", "table", "url", "wordPaste"],
        //pluginsEnabled: ["align", "colors", "draggable", "embedly", "emoticons", "entities", "file", "image", "imageManager", "lineBreaker", "link", "lists", "paragraphFormat", "paragraphStyle", "quickInsert", "quote", "save", "table", "url", "video", "wordPaste"],
    };

    constructor(private api: ApiService, private route: ActivatedRoute, private router: Router){}

    ngOnInit() {
		this.new_topic = new Topic();
		this.user = new User();
		this.theme = new Theme();
		
		this.route.params.subscribe(
		(params) => {
			this.theme_id = params['theme'];
			this.customInit();
		});
		
		this.api.getUser().subscribe(
            data => {
                this.user = new User();
                Object.assign(this.user, data)
            },
            err => {
                console.log(err)
            }
        );
	}
	
	customInit() {
		this.api.get<Theme>("forum/" + this.theme_id + "/").subscribe(
		    data => {
				this.theme = new Theme();
                Object.assign(this.theme, data);
			},
            error => {
                this.error = error;
                console.log(error);
            }
		);
		
		this.api.get<[Topic]>("theme/?theme=" + this.theme_id).subscribe(
		    data => {
				this.list_topics = data;
				if(this.list_topics.length == 0)
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
		if(this.new_topic.is_hidden_1A == undefined)
		{
			this.new_topic.is_hidden_1A = false;
		}
        this.api.post("theme/", {
			name: this.new_topic.name,
			is_hidden_1A: this.new_topic.is_hidden_1A,
			theme: this.theme.id,
			}).subscribe(
            data => {
				let topic = new Topic();
                Object.assign(topic, data);
				
				this.api.post("topic/", {
					message: this.first_message,
					topic: topic.id
					}).subscribe(
					data => {
						this.router.navigate(['forum/topic/'+topic.id]);
					},
					err => this.error = err.message
				)
            },
            err => this.error = err.message
        )
    }

}
