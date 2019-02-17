import {Component, ElementRef, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";

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
    editing = false;

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

        this.api.get('users/').subscribe(
            users => this.users = users,
            error => this.error = error.message
        );
        this.api.get("associations/" + id + "/").subscribe(
            association => {
                this.association = association;
            },
            error => this.error = error.message
        );
    }

    addPermission(){
        this.association.permissions.push({
            "role": "Membre",
            "association": this.association.id
        })
    }

    savePermission(permission){

        let req = Object.assign({}, permission) ;
        req.user = req.user.id ;


        if(permission.id){
            this.api.put(`permissions/${permission.id}/`, req).subscribe(
                res => this.status = "Toutes les modifications en enregistrées",
                error => this.error = error.message
            )
        } else {
            this.api.post(`permissions/`, req).subscribe(
                (res:any) => {
                    permission.id = res.id ;
                    this.status = "Toutes les modifications en enregistrées";
                },
                error => this.error = error.message
            )
        }
    }

    deletePermission(permission) {
        console.log(permission);
        this.status = "Supression...";
        this.api.delete(`permissions/${permission.id}/`).subscribe(
            res => {
                this.status = "Autorisation retirée" ;
                this.association.permissions.splice(this.association.permissions.indexOf(permission), 1)
            },
            error => this.error = error.message
        )
    }

}
