import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../api.service";
import {ActivatedRoute, Router} from "@angular/router";

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
        let uniqToken = "?unique=" + Date.now(); // This token prevents the cache from being called, which leads to
                                                 // displaying files that were just deleted in the database

        if (folderId == null) {
            this.api.get(`associations/${this.association_id}/filesystem/root` + uniqToken).subscribe(
                folder => this.folder = folder,
                error => this.error = error
            )
        } else {
            this.api.get(`folder/${folderId}` + uniqToken).subscribe(
                folder => this.folder = folder,
                error => this.error = error
            )
        }
    }

    openFolder(folder) {
        this.router.navigateByUrl(`associations/${this.association_id}/files/${folder.id}`);
    }

    openFile(file) {
        this.router.navigateByUrl(`associations/${this.association_id}/file/${file.id}`);
    }

    createFolder() {
        let name = prompt("Entrez le nom du nouveau dossier");

        if (name && name.length > 0) {
            this.api.post("folder/", {
                "name": name,
                "parent": this.folder_id,
                "association": this.association_id,
                "children": [],
                "files": []
            }).subscribe(
                res => this.folder.children.push(res),
                err => this.error = err.message
            )
        }
    }

    deleteFolder() {
        if (confirm("Supprimer le dossier ? Tous ses élements seront transférés dans le dossier parent")) {
            this.api.delete(`folder/${this.folder_id}/`).subscribe(
                res => {
                    let folder = "";
                    if (this.folder.parent) {
                        folder = this.folder.parent;
                    }

                    this.router.navigateByUrl(`associations/${this.association_id}/files/${folder}`)
                },
                err => this.error = err.message
            )
        }
    }

    editFolderName() {
        let name = prompt("Entrez le nouveau nom du dossier");

        if (name && name.length > 0) {
            this.api.patch(`folder/${this.folder_id}/`, {
                "name": name,
            }).subscribe(
                res => this.folder = res,
                err => this.error = err.message
            )
        }
    }

}
