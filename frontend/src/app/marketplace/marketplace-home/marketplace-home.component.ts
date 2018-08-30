import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-marketplace-home',
  templateUrl: './marketplace-home.component.html',
  styleUrls: ['./marketplace-home.component.scss']
})
export class MarketplaceHomeComponent implements OnInit {

    marketplace: any ;
    error: any ;

    constructor(private api: ApiService, private route: ActivatedRoute){}

    ngOnInit() {
		this.route.params.subscribe(
		(params) => {
			let id = params['id'];

            this.api.get(`rest/marketplace/${id}`).subscribe(
                marketplace => this.marketplace = marketplace,
                error => { this.error = error.message ; console.log(error) ; }
            );
		});
    }
}
