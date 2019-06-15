import { ChangeDetectorRef, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ApiService } from "../../../api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AssociationFilesystemBreadcrumbComponent } from "../association-filesystem-breadcrumb/association-filesystem-breadcrumb.component";

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

    @ViewChild(AssociationFilesystemBreadcrumbComponent) breadcrumb ;

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
        let input = new FormData();
        input.append('name', file.name);
        input.append('description', file.description);
        input.append('association', this.association.id);

        if (file.folder) {
            console.log(file.folder);
            input.append('folder', file.folder);
        }

        this.api.patch(`file/${file.id}/`, input).subscribe(
            _ => this.isEditing = false,
            err => this.error = err.message
        );
    }

    deleteFile(file) {
        this.api.delete(`file/${file.id}/`).subscribe(
            _ => this.router.navigate([`associations/${this.association.id}/files`]),
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

    handleFileMoved($event){
        this.file.folder = $event.folder;
        this.breadcrumb.folder = null;
        this.breadcrumb.refreshDisplay();
    }
}
