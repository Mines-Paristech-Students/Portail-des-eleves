import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { ApiService } from "../../../api.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-association-filesystem-file',
    templateUrl: './association-filesystem-file.component.html',
    styleUrls: ['./association-filesystem-file.component.scss']
})
export class AssociationFilesystemFileComponent implements OnInit {

    association: any;
    file: any;

    association_id: string;
    file_id: string;

    isEditing: boolean = false;

    error = "";

    constructor(private api: ApiService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.route.params.subscribe(
            (params) => {
                this.association_id = params['id'];
                this.file_id = params['file_id'];

                this.api.get(`associations/${this.association_id}/`).subscribe(
                    association => this.association = association,
                    error => {
                        this.error = error.message;
                        console.log(error);
                    }
                );

                this.api.get(`file/${this.file_id}/`).subscribe(
                    file => this.file = file,
                    error => {
                        this.error = error.message;
                        console.log(error);
                    }
                );
            }
        );
    }

    saveFile(file) {
        let clone = {...file};
        delete clone["file"];
        console.log(clone);

        this.api.patch(`file/${file.id}/`, clone).subscribe(
            _ => 0,
            err => this.error = err.message
        );
    }

    deleteFile(file) {
        this.api.delete(`file/${file.id}/`).subscribe(
            _ => this.file = null,
            err => this.error = err.message
        );
    }

    exitFile() {
    }

    handleEditButton() {
        this.isEditing = true;
    }

    handleDeleteButton() {
        this.deleteFile(this.file);
        this.exitFile()
    }

    handleSaveButton() {
        this.saveFile(this.file);
        this.exitFile();
    }
}
