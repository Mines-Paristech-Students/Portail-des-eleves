import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../api.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-filesystem',
    templateUrl: './association-filesystem-browser.component.html',
    styleUrls: ['./association-filesystem-browser.component.scss']
})
export class AssociationFilesystemBrowserComponent implements OnInit {
    error: string = "";

    association_id: string;
    association: any;
    folder_id: number;
    folder: any;

    constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.route.params.subscribe(
            (params) => {
                this.association_id = params['id'];
                this.folder_id = params['folder_id'];

                this.api.get(`associations/${this.association_id}/`).subscribe(
                    association => {
                        this.association = association;
                        this.loadFolderById(this.folder_id);
                    },
                    error => {
                        this.error = error;
                        console.log(error);
                    }
                );
            }
        );
    };

    loadFolderById(folderId) {
        if (folderId == null) {
             this.api.get(`associations/${this.association.id}/filesystem/root`).subscribe(
                 folder => this.folder = folder,
                 error => this.error = error
             )
        } else {
             this.api.get(`folder/${folderId}`).subscribe(
                 folder => this.folder = folder,
                 error => this.error = error
             )
        }
    }

    openFolder(folder) {
        this.router.navigateByUrl(`associations/${this.association.id}/files/${folder.id}`);
    }

    openFile(file){
        this.router.navigateByUrl(`associations/${this.association.id}/file/${file.id}`);
    }

}
