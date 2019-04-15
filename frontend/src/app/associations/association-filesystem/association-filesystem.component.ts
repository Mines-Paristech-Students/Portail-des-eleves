import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpHeaders } from "@angular/common/http";

@Component({
    selector: 'app-filesystem',
    templateUrl: './association-filesystem.component.html',
    styleUrls: ['./association-filesystem.component.scss']
})
export class AssociationFilesystemComponent implements OnInit {
    error: string = "";

    association_id: string;
    association: any;
    folder_id: number;
    folder: any;

    selected_file: any;
    adding_file: boolean = false;

    constructor(private api: ApiService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal) {
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
            });
    };


    loadFolderById(folderId) {
        if (folderId == null) {
            this.folder = this.api.get(`associations/${this.association.id}/filesystem/root`)
        } else {
            this.folder = this.api.get(`folder/${folderId}`)
        }
    }

    openFolder(folder) {
        this.router.navigateByUrl(`associations/${this.association.id}/files/${folder.id}`);
    }

    selectFile(file) {
        if (this.selected_file == file) {
            this.selected_file = null;
        } else {
            this.selected_file = file;
        }
    }

    onExitAddingFile() {
        this.adding_file = false;
        this.loadFolderById(this.folder_id);
    }

    onExitFile() {
        this.selected_file = null;
        this.loadFolderById(this.folder_id);
    }

    onSubmitFile(data) {
        let url = `file/`;

        data = {
            name: data.fileName,
            description: data.description,
            association: this.association.id,
            file: data.file,
            folder: this.folder_id === undefined ? null : this.folder_id
        };

        console.log(data);

        let headers = new HttpHeaders();
        headers.set('Content-Type', 'undefined');

        this.api.post<Object>(url, data, headers).subscribe(
            next => console.log(next),
            error => console.error(error),
        );
        this.onExitAddingFile();
    }
}
