import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-library-manager-catalog',
    templateUrl: './library-manager-catalog.component.html',
    styleUrls: ['./library-manager-catalog.component.scss']
})
export class LibraryManagerCatalogComponent implements OnInit {

    editing = {};
    library: any ;
    error: any;

    constructor(private api: ApiService, private route: ActivatedRoute) {}

    ngOnInit() {
		this.route.params.subscribe(
		(params) => {
            let id = params['id'];

            this.api.get(`library/${id}/`).subscribe(
                library => this.library = library,
                error => { this.error = error.message ; console.log(error) ; }
            );
		});
    }

    newLoanable() {
        let loanable = {
            library: this.library.id,
            name: "Nouveau produit",
            description: "",
            comment: "",
        };

        this.api.post("loanables/", loanable).subscribe(
            loanable => {
                this.library.loanables.push(loanable);
                // @ts-ignore
                this.editing[loanable.id] = true
            },
            err => this.error = err.message
        )
    }

    startEdit(loanable) {
        this.editing[loanable.id] = true;
    }

    endEdit(loanable) {
        if (loanable.name != "") {
            this.editing[loanable.id] = false;

            this.api.put(`loanables/${loanable.id}/`, loanable).subscribe(
                res => 0,
                err => {
                    this.error = err.message;
                    console.log(err)
                }
            );
        }
    }

    delete(loanable) {
        const index: number = this.library.loanables.indexOf(loanable);
        if (index !== -1) {
            this.library.loanables.splice(index, 1);
        }

        this.api.delete(`loanables/${loanable.id}/`).subscribe(
            res => 0,
            err => this.error = err.message
        )
    }

}
