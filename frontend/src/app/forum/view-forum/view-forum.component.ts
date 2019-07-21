import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-view-forum',
  templateUrl: './view-forum.component.html',
  styleUrls: ['./view-forum.component.scss']
})
export class ViewForumComponent implements OnInit {

    list_themes: any ;

    error: any ;

    constructor(private api: ApiService, private route: ActivatedRoute){}

    ngOnInit() {
        this.api.get("forum/").subscribe(
		    data => {
				this.list_themes = data;
			},
            error => {
                this.error = error;
                console.log(error);
            }
		);
    }
}
