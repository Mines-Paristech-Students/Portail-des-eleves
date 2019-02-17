import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";
import {BasketManagerServiceService} from "../../marketplace/basketManager.service";
import {map, mergeMap, scan} from "rxjs/operators";

@Component({
    selector: 'library',
    templateUrl: './library-catalog.component.html',
    styleUrls: ['./library-catalog.component.scss']
})
export class LibraryCatalogComponent implements OnInit {

    p = 0; // The current page
    protected numberOfItems = 0 ;
    loanables: any;

    library: any;
    error: any;


    constructor(private api: ApiService, private route: ActivatedRoute, private manager: BasketManagerServiceService) {
    }

    ngOnInit() {
        this.route.params.subscribe(
            (params) => {
                let id = params['id'];

                let req = this.api.get(`library/${id}/`);

                req.subscribe(
                    library => {
                        this.library = library;
                    },
                    error => {
                        this.error = error.message;
                        console.log(error);
                    }
                );

                this.loanables = req.pipe(
                    // @ts-ignore
                    map(m => m.loanables),
                    mergeMap(p => p),
                    // @ts-ignore
                    scan((acc, value) => [...acc, value], [])
                );
            });
    }

}
