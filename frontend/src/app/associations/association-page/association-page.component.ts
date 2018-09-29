import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute, Router} from "@angular/router";

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

    froalaOptions = {
        pluginsEnabled: ["align", "colors", "draggable", "embedly", "emoticons", "entities", "lineBreaker", "link", "lists", "paragraphFormat", "paragraphStyle", "quickInsert", "quote", "save", "table", "url", "wordPaste"],
        //pluginsEnabled: ["align", "colors", "draggable", "embedly", "emoticons", "entities", "file", "image", "imageManager", "lineBreaker", "link", "lists", "paragraphFormat", "paragraphStyle", "quickInsert", "quote", "save", "table", "url", "video", "wordPaste"],
    };


    constructor(private api: ApiService, private route: ActivatedRoute, private router: Router){}

    ngOnInit() {
        const association_id = this.route.snapshot.paramMap.get('association_id');
        const page_id = this.route.snapshot.paramMap.get('page_id');

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
            },
            err => this.status = "<span class='text-danger'>" + err.message + "</span>"
        );
    }

    delete() {
        if(alert("Supprimer la page ?")) {
            this.api.delete("pages/" + this.page.id + "/").subscribe(
                res => this.router.navigate(["associations/" + this.association.id]),
                err => this.status = "<span class='text-danger'>" + err.message + "</span>"
            )
        }
    }

}

