import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../models/user";

@Component({
    selector: 'library-loans',
    templateUrl: './library-loans.component.html',
    styleUrls: ['./library-loans.component.scss']
})
export class LibraryLoansComponent implements OnInit {

    p = 0; // The current page
    protected numberOfItems = 0;
    loans: any;

    library: any;
    error: any;

    user: User;
    today = Date();

    constructor(private api: ApiService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.subscribe(
            (params) => {
                let library_id = params['id'];

                this.api.getUser().subscribe(
                    data => {
                        // The user variable explicitly needs to be from the User type
                        //  so the ".promotion" property can be called from the html template.
                        this.user = new User();
                        Object.assign(this.user, data);

                        this.api.get(`library/${library_id}/`).subscribe(
                            library => {
                                this.library = library;
                            },
                            error => {
                                this.error = error.message;
                                console.log(error);
                            }
                        );

                        this.loans = this.api.get(`loans/?user=${this.user.id}&library=${library_id}`);
                    },
                    err => {
                        console.log(err)
                    }
                );

            });
    }

}
