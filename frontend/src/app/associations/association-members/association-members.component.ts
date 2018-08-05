import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-association-members',
  templateUrl: './association-members.component.html',
  styleUrls: ['./association-members.component.scss']
})
export class AssociationMembersComponent implements OnInit {

	association: any ;
	error: any ;

	constructor(private api: ApiService, private route: ActivatedRoute){}

	ngOnInit() {
		const id = this.route.snapshot.paramMap.get('id');
		this.api.get("rest/associations/" + id + "/").subscribe(
			association => this.association = association,
			error => this.error = error.message
        );
	}
}
