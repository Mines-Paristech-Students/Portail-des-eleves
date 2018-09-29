import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Component({
    selector: 'app-association-show',
    templateUrl: './association-homepage.component.html',
    styleUrls: ['./association-homepage.component.scss']
})
export class AssociationHomepageComponent implements OnInit {

    association: any ;
    news: any;

    error: any ;
	
	id : any;

    constructor(private api: ApiService, private route: ActivatedRoute){}

    ngOnInit() {
		this.route.params.subscribe(
		(params) => {
			this.id = params['id'];
			this.customInit();
		});
    }
	
	customInit(){
		console.log(this.id);
        this.api.get("associations/" + this.id + "/").subscribe(
            association => this.association = association,
            error => {
                this.error = error;
                console.log(error);
            }
        );
		

        this.api.get('news/?association=' + this.id).subscribe(
            news => this.news = news,
            error => {
                this.error = error;
                console.log(error);
            }
        );
	}

}
