import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { ApiService } from "../../../api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-association-filesystem-file',
    templateUrl: './association-filesystem-file.component.html',
    styleUrls: ['./association-filesystem-file.component.scss']
})
export class AssociationFilesystemFileComponent implements OnInit {
    @Input() file: any;
    @Output() exitEmitter: EventEmitter<boolean>;

    isEditing: boolean = false;

    error = "";

    constructor(private api: ApiService,
                private route: ActivatedRoute,
                private router: Router,
                private modalService: NgbModal) {
        this.exitEmitter = new EventEmitter<boolean>();
    }

    ngOnInit() {
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
        this.exitEmitter.emit(true);
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
