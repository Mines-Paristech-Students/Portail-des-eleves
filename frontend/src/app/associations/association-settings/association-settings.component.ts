import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../api.service";

@Component({
    selector: 'app-association-settings',
    templateUrl: './association-settings.component.html',
    styleUrls: ['./association-settings.component.scss']
})
export class AssociationSettingsComponent implements OnInit {

    association: any ;
    error: any ;

    constructor(private api: ApiService, private route: ActivatedRoute){}

    ngOnInit() {
        this.route.params.subscribe(
        (params) => {
            let id = params['id'];

            this.api.get("rest/associations/" + id + "/").subscribe(
                association => this.association = association,
                error => {
                    this.error = error.message ;
                    console.log(error);
                }
            );
        });
    }

    enableMarketplace(){
        this.api.patch("rest/marketplace/" + this.association.marketplace.id + "/", {enabled: true}).subscribe(
            marketplace => this.association.marketplace = marketplace,
            err => this.error = err.message
        )
    }

    disableMarketplace(){
        this.api.patch("rest/marketplace/" + this.association.marketplace.id + "/", {enabled: false}).subscribe(
            marketplace => this.association.marketplace = marketplace,
            err => this.error = err.message
        )
    }

    enableLibrary(){
        this.api.patch("rest/library/" + this.association.library.id + "/", {enabled: true}).subscribe(
            library => this.association.library = library,
            err => this.error = err.message
        )
    }

    disableLibrary(){
        this.api.patch("rest/library/" + this.association.library.id + "/", {enabled: false}).subscribe(
            library => this.association.library = library,
            err => this.error = err.message
        )
    }
}
