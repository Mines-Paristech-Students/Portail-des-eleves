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
	error: string ;
	status: string ;

	users: any ;
	editing = true ;

	rightFields = [
		["Administrateur", "is_admin_group"],
		["Editer les pages statiques", "static_page"],
		["Publier des news", "news"],
		["Accéder au magasin", "marketplace"],
		["Accéder aux prêts", "library"],
		["Gérer les votes", "vote"],
		["Créer des évenements", "events"]
	];

	constructor(private api: ApiService, private route: ActivatedRoute){}

	ngOnInit() {
		const id = this.route.snapshot.paramMap.get('id');
		this.api.get("rest/associations/" + id + "/").subscribe(
			association => this.association = association,
			error => this.error = error.message
        );

		this.api.get('rest/users/').subscribe(
			users => this.users = users,
			error => this.error = error.message
		)
	}

	stopEdit(){
		if(this.association.groups.filter(g => g.is_admin_group).map(g => g.members.length).reduce((sum, current) => sum + current, 0) > 0) {
			this.status = "" ;
            this.editing = false;

            this.api.put('rest/associations/' + this.association.id + "/", this.association).subscribe(
            	res => this.status = "<span class='text-success'>Groupes mis à jour</span>",
            	err => { console.log(err) ; this.status = "<span class='text-danger'>" + err.message + "</span>" }
			)
        } else {
			this.status = "<span class='text-danger'>L'association doit avoir au moins un groupe administrateur qui doit avoir au moins un membre</span>"
		}
	}

	createGroup(){
		this.association.groups.push({
			role: "Nouveau groupe"
		})
	}

	deleteGroup(group) {
		this.association.groups.remove(g => g.id == group.id)
	}

	addPeople(group){
		group.members.push()
	}

	removePeople(group, people){
		group.members.splice(group.members.indexOf(people), 1)
	}

	save(){

	}
}
