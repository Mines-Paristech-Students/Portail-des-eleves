import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute, Router} from "@angular/router";
import { MarkdownService } from 'ngx-markdown'
import { EditorOption } from 'angular-markdown-editor';
import { RequestCacheService} from '../../request-cache.service'

@Component({
  selector: 'app-association-page',
  templateUrl: './association-page.component.html',
  styleUrls: ['./association-page.component.scss']
})
export class AssociationPageComponent implements OnInit {

    association: any ;
    page: any;

    error: any ;
    status = "";

    editing = false ;
    editorOptions: EditorOption;




    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        private router: Router,
        private markdownService: MarkdownService,
        private cache: RequestCacheService){}

    ngOnInit() {
        this.editorOptions = {
            parser: (val) => this.markdownService.compile(val.trim())
        };
        this.route.params.subscribe(
            params => {
                const association_id = params['association_id'];
                const page_id = params['page_id'];
                this.loadAssociationData(association_id, page_id)
            }
        )
    }

    loadAssociationData(association_id, page_id){
        this.api.get("associations/" + association_id + "/").subscribe(
            association => this.association = association,
            error => {
                this.error = error;
                console.log(error);
            }
        );

        this.api.get('pages/' + page_id + "/").subscribe(
            page => this.page = page,
            error => this.error = error.message
        );
    }

    save(){
        this.api.put("pages/" + this.page.id + "/", this.page).subscribe(
            res => {
                this.status = "<span class='text-success'>Modifications enregistrées</span>" ;
                this.association.pages.filter(p => p.id == this.page.id)[0].title = this.page.title ;
                this.editing = false;
            },
            err => this.status = "<span class='text-danger'>" + err.message + "</span>"
        );
    }

    delete() {
        if(confirm("Supprimer la page ?")) {
            this.api.delete("pages/" + this.page.id + "/").subscribe(
                res => {
                    this.cache.remove(`associations/${this.association.id}/`);
                    this.cache.remove(`pages/${this.page.id}/`);
                    this.router.navigate(["associations/" + this.association.id])
                },
                err => this.status = "<span class='text-danger'>" + err.message + "</span>"
            )
        }
    }

}

