import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";
import { DragulaService } from "ng2-dragula";
import { Observable, pipe } from 'rxjs'
import { map } from 'rxjs/operators'
@Component({
    selector: 'app-association-members',
    templateUrl: './association-members.component.html',
    styleUrls: ['./association-members.component.scss']
})
export class AssociationMembersComponent implements OnInit {

    association: any;
    error: string;
    status: string;
    roles: any;
    is_editing: boolean; // If editing something
    editing: number; // The role being edited or null
    creating: boolean;
    creating_role: any;

    // For the ng select field
    ng_select_loading: boolean
    ng_select_users: Observable<any[]>
    ng_select_value: any;

    rightFields = [
        ["Editer les pages statiques", "static_page"],
        ["Publier des news", "news"],
        ["Accéder au magasin", "marketplace"],
        ["Accéder aux prêts", "library"],
        ["Gérer les votes", "vote"],
        ["Créer des évenements", "events"]
    ];

    constructor(private api: ApiService, private route: ActivatedRoute, private dragulaService: DragulaService){}

    ngOnInit() {
        this.roles = []
        this.creating_role = {}

        const association_id = this.route.snapshot.paramMap.get('id');

        this.dragulaService.createGroup(
            "MEMBERS", {
                moves: (el, source, handle, sibling) => {
                    return this.is_editing && handle.className === 'card-header';
                },
                accepts: (el, target, source, sibling) => {
                    return sibling !== null
                },
                direction: 'horizontal'
            }
        )
        this.api.get(`associations/${association_id}/`).subscribe(
            association => {
                this.association = association;
            },
            error => {
                this.error = error.message
            }
        );

        this.api.get(`roles/?association=${association_id}`).subscribe(
            (roles:any[]) => {
                this.roles = roles.map(
                    el => {
                        el.editing = false
                        return el
                    }
                )
            },
            error => {
                this.error = error.message
            }
        )

        this.editing = null;
        this.is_editing = false;
        this.ng_select_value = null;
    }

    ngOnDestroy(){
        this.dragulaService.destroy("MEMBERS")
    }

    startEditing(){
        this.is_editing = true;
        this.load_more_user('')
    }

    onEdit(role){
        this.editing = role.id
    }

    deleteRole(){
        let role_i = this.roles.findIndex(x => x.id === this.editing)
        let role = this.roles[role_i]
        this.api.delete(`roles/${role.id}/`).subscribe(
            data => {
                this.roles.splice(role_i, 1) // Remove the role from the role list
                this.editing = null
                this.ng_select_value = null
            },
            err => {
                this.error = err.message
            }
        )
    }
    saveSingleRole(){
        let role_i = this.roles.findIndex(x => x.id === this.editing)
        let data = JSON.parse(JSON.stringify(this.roles[role_i]))
        if(this.ng_select_value !== null && this.ng_select_value.id !== data.user.id){
            delete data.id
            data.user = this.ng_select_value.id
            this.api.post('roles/', data).subscribe(
                d1 => {
                    this.api.delete(`roles/${this.editing}/`).subscribe(
                        d2 => {
                            console.log(d1)
                            this.roles[role_i] = d1
                            console.log(this.roles)
                            this.editing = null
                            this.ng_select_value = null
                        },
                        err2 => {
                            this.error = err2.message
                        }
                    )
                },
                err => {
                    this.error = err.message
                }
            )
        } else {
            data.user = data.user.id
            this.api.patch(`roles/${this.editing}/`, data).subscribe(
                d => {
                    this.editing = null
                    this.ng_select_value = null
                },
                err => {
                    this.error = err.message
                }
            )
        }
    }

    createRole() {
        if(this.ng_select_value !== null){
            let data = JSON.parse(JSON.stringify(this.creating_role))
            data.association = this.association.id
            data.user = data.user.id
            if(this.roles.length > 0){
                data.rank = this.roles.reduce(function (prev, current) {
                    return (prev.rank > current.rank) ? prev : current
                 }).rank + 1;
            }
            else {
                data.rank = 0;
            }
            this.api.post('roles/', data).subscribe(
                d => {
                    this.creating = false
                    this.creating_role = {}
                    this.roles.push(d)
                    this.ng_select_value = null
                }
            )
        }
    }

    finishEditing(){
        let role_copy = JSON.parse(JSON.stringify(this.roles));
        for (let i = 0; i < this.roles.length; i++) {
            this.roles[i].rank = i
            role_copy[i].rank = i
            role_copy[i].user = role_copy[i].user.id
        }
        this.api.patch(`roles/`, role_copy).subscribe(
            data => {
                this.is_editing = false;

            },
            err => {
                this.error = err.message
            }
        )
    }

    addMember(){
        this.creating = true;
    }

    load_more_user(event){
        this.ng_select_loading = true;
        let known_users = []
        for (let i = 0; i < this.roles.length; i++) {
            const role = this.roles[i];
            known_users.push(role.user.id)
        }
        this.ng_select_users = this.api.get(`users/?startswith=${event}&quantity=10`).pipe(
            map(
                (elements:any[]) => {
                    return elements.filter(el => !known_users.includes(el.id))
                }
            )
        )
        this.ng_select_users.subscribe(
            data => {
                this.ng_select_loading = false;
            }
        )
    }

    user_changed(event){
        this.ng_select_value = event;
    }
/*
    stopEdit(){
        if(this.association.groups.filter(g => g.is_admin_group).map(g => g.members.length).reduce((sum, current) => sum + current, 0) > 0) {
            this.status = "" ;

            let groups = [];
            for(let group of this.association.groups){
                let members = [];
                for(let m of group.members){
                    let id = m;
                    if(id.hasOwnProperty("id")){
                        id = id.id
                    }

                    members.push(id)
                }
                groups.push({
                    id: group.id ? group.id : -1,
                    members: members,

                    is_admin_group: group.is_admin_group,
                    role: group.role,

                    library: group.library,
                    marketplace: group.marketplace,
                    news: group.news,
                    static_page: group.static_page,
                    vote: group.vote
                })
            }

            this.api.patch(`groups/batch_add_update/`, {"groups" :groups, "association": this.association.id}).subscribe(
                res => {
                    this.status = "<span class='text-success'>Groupes mis à jour</span>"
                    this.editing = false;
                    this.association = res
                },
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
        this.association.groups.splice(this.association.groups.indexOf(group), 1)
    }*/

}
