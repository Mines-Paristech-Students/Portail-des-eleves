import {Component, OnInit, Input} from '@angular/core';
import {ApiService} from "../../../api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-association-filesystem-file',
    templateUrl: './association-filesystem-file.component.html',
    styleUrls: ['./association-filesystem-file.component.scss']
})
export class AssociationFilesystemFileComponent implements OnInit {
    @Input() file: any;
    error = "";
    editing = false;

    constructor(private api: ApiService,
                private route: ActivatedRoute,
                private router: Router,
                private modalService: NgbModal) {
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
}
