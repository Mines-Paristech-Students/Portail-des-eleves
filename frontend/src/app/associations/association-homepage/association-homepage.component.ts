import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import { MarkdownService } from 'ngx-markdown'
import { EditorOption } from 'angular-markdown-editor';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-association-show',
    templateUrl: './association-homepage.component.html',
    styleUrls: ['./association-homepage.component.scss']
})
export class AssociationHomepageComponent implements OnInit {

    association: any ;
    news: {'id': number, 'title': string, 'text': string, 'editing'?: boolean}[]
    error: any ;

	association_id : any;

    editorOptions: EditorOption;

    is_writing_news : boolean;
    the_new_news : {'title': string, 'text': string}

    constructor(private api: ApiService, private route: ActivatedRoute, private markdownService: MarkdownService){}

    ngOnInit() {
		this.route.params.subscribe(
		(params) => {
			this.association_id = params['id'];
			this.load_association_data();
        });
        this.editorOptions = {
            parser: (val) => this.markdownService.compile(val.trim())
        };
        this.is_writing_news = false;
        this.the_new_news = {'title': '', 'text': ''}
    }

	load_association_data(){
        this.api.get("associations/" + this.association_id + "/").subscribe(
            association => this.association = association,
            error => {
                this.error = error;
                console.log(error);
            }
        );


        this.api.get('news/?association=' + this.association_id).subscribe(
            (news:any) => {
                this.news = news;
            },
            (error:any) => {
                this.error = error;
                console.log(error);
            }
        );
    }

    createNews(){
        this.is_writing_news = true;
        this.the_new_news = {'title': '', 'text': ''}
    }

    editNews(the_news){
        // Display a markdown editor to change the content of the news
        the_news.editing = true
    }

    finishEditing(the_news){
        // Stop editing and publish news to the server
        let data = {
            "title": the_news.title,
            "text": the_news.text,
            "association": this.association_id
        }
        this.api.put('news/' + the_news.id + "/", data).pipe(
            finalize(
                () => {
                    the_news.editing = false;
                }
            )
        ).subscribe(
            (data:any) => {
                the_news.title = data.title;
                the_news.text = data.text
            },
            (err:any)=> {
                this.error = err;
            }
        )
    }

    deleteNews(the_news){
        this.api.delete('news/' + the_news.id + "/").subscribe(
            (_:any) => {
                let news: {'id', 'title': string, 'text': string, 'editing'?: boolean}[] = []
                for (var n of this.news){
                    if (n.id !== the_news.id){
                        news.push(n)
                    }
                }
                this.news = news
            },
            err => {
                this.error = err;
            }
        )
    }

    publishNews(){
        let post_data = {
            "title": this.the_new_news.title,
            "text": this.the_new_news.text,
            "association": this.association_id
        }
        this.api.post('news/', post_data).pipe(
            finalize(
                () => {
                    this.is_writing_news = false;
                    this.the_new_news = {'title': '', 'text': ''}
                }
            )
        ).subscribe(
            (data:any) => {
                this.news.unshift(data)
            },
            (err:any) => {
                this.error = err;
            }
        )
    }

    cancelPublishNews(){
        this.is_writing_news = false;
        this.the_new_news = {'title': '', 'text': ''}
    }

}
