import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from "../../../api.service";

@Component({
    selector: 'association-filesystem-breadcrumb',
    templateUrl: './association-filesystem-breadcrumb.component.html',
    styleUrls: ['./association-filesystem-breadcrumb.component.scss']
})
export class AssociationFilesystemBreadcrumbComponent implements OnInit {

    @Input() association;
    @Input() folder;
    @Input() selected_file;

    constructor(private api: ApiService) {
    }

    ngOnInit() {
        console.log(this.selected_file)
        if (this.selected_file && !this.folder) {
            this.api.get(`folder/${this.selected_file.folder}/`).subscribe(
                folder => {
                    this.folder = folder;
                    console.log(folder)
                },
                err => console.log(err)
            );
        }
    }

}
