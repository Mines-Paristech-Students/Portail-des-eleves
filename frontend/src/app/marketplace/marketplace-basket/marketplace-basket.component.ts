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

            this.api.get('rest/marketplace/?association=' + id).subscribe(
                (res : Array<any>) => {
                    if((res as Array<any>).length >= 1) {
                        this.marketplace = res[0];
                    } else {
                        this.error = "Magasin non trouvé"
                    }
                },
                error => this.error = error.message
            );
		});
    }

}
