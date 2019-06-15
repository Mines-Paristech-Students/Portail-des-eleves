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
        console.log(this.selected_file);
        if (this.selected_file && !this.folder) {
            var  url = `associations/${this.selected_file.association}/filesystem/root`;
            if (this.selected_file.folder != null) {
                url = `folder/${this.selected_file.folder}/` ;
            }

            this.api.get(url).subscribe(
                folder => {
                    this.folder = folder;
                },
                err => console.error(err)
            );
        }
    }

}
