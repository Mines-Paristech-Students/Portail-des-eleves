import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-association-page',
  templateUrl: './association-page.component.html',
  styleUrls: ['./association-page.component.scss']
})
export class AssociationPageComponent implements OnInit {

    association: any ;
    page: any;

    error: any ;

    constructor(private api: ApiService, private route: ActivatedRoute){}

    ngOnInit() {
        const association_id = this.route.snapshot.paramMap.get('association_id');
        const page_id = this.route.snapshot.paramMap.get('page_id');

        this.api.get("rest/association/" + association_id + "/").subscribe(
            association => this.association = association,
            error => {
                this.error = error;
                console.log(error);
            }
        );

        this.api.get('rest/pages/' + page_id + "/").subscribe(
            page => this.page = page,
            error => {
                this.error = error;
                console.log(error);
            }
        );

    }

}

