import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-filesystem',
    templateUrl: './association-filesystem.component.html',
    styleUrls: ['./association-filesystem.component.scss']
})
export class AssociationFilesystemComponent implements OnInit {

    association: any ;
    error = "" ;

    $folder: any ;

    constructor(private api: ApiService, private route: ActivatedRoute) {
    }

    ngOnInit() {

        this.route.params.subscribe(
            (params) => {
                let association_id = params['id'];
                this.api.get(`associations/${association_id}/`).subscribe(
                    association => {
                        this.association = association ;
                        this.loadFolder(null);
                    },
                    error => {
                        this.error = error;
                        console.log(error);
                    }
                );
            });
    };


    loadFolder(folder){

        if(folder == null){
            this.$folder = this.api.get(`associations/${this.association.id}/filesystem/root`)
        }

    }
}
