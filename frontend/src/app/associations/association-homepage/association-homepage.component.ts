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

    constructor(private api: ApiService, private route: ActivatedRoute){}

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.api.get("rest/associations/" + id + "/").subscribe(
            association => this.association = association,
            error => {
                this.error = error;
                console.log(error);
            }
        );

        this.api.get('rest/news/?association=' + id).subscribe(
            news => this.news = news,
            error => {
                this.error = error;
                console.log(error);
            }
        );

    }

}
