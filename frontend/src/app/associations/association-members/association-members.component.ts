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
	members : any[];

	constructor(private api: ApiService, private route: ActivatedRoute){}

	ngOnInit() {
		this.members = new Array();
		const id = this.route.snapshot.paramMap.get('id');
		this.api.get("rest/association/" + id + "/").subscribe(
			association => this.customInit(association),
			error => {
				this.error = error;
				console.log(error);
			}
        );
	}
	
	customInit(association){
		this.association = association;
		
		console.log(association);
		
		for(let group of this.association.groups)
		{
			var role = group.role;
			for(let member of group.members)
			{
				this.members.push({id:member.id, first_name:member.first_name, last_name:member.last_name, role:role});
			}
		}
		console.log(this.members);
	}

}
