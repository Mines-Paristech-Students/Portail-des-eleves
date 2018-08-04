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
		this.route.params.subscribe((params:Params) => {
        this.id = params['id'];
        this.customInit();
		});
    }
	
	customInit(){
		console.log(this.id);
        this.api.get("rest/association/" + this.id + "/").subscribe(
            association => this.association = association,
            error => {
                this.error = error;
                console.log(error);
            }
        );

        this.api.get('rest/news/?association=' + this.id).subscribe(
            news => this.news = news,
            error => {
                this.error = error;
                console.log(error);
            }
        );
	}

}
