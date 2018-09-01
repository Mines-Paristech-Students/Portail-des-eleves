import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-marketplace-basket',
  templateUrl: './marketplace-basket.component.html',
  styleUrls: ['./marketplace-basket.component.scss']
})
export class MarketplaceBasketComponent implements OnInit {

    marketplace: any ;
    error: any ;

    constructor(private api: ApiService, private route: ActivatedRoute){}

    ngOnInit() {
		this.route.params.subscribe(
		(params) => {
			let id = params['id'];

            this.api.get(`rest/marketplace/${id}/`).subscribe(
                marketplace => this.marketplace = marketplace,
                error => this.error = error.message
            );
		});
    }
}
