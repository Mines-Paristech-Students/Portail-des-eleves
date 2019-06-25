import { Component, OnInit } from '@angular/core';
import { ApiService } from "../api.service";
import { ActivatedRoute, Router } from "@angular/router";

/**
 * IMPORTANT NOTE
 * This is NOT a component that interacts in a way or another with facebook.com (in a nutshell, the social network)
 * This component is called "facebook" because it's the closest translation of the french "trombinoscope"
 */

@Component({
    selector: 'app-facebook',
    templateUrl: './facebook.component.html',
    styleUrls: ['./facebook.component.scss']
})
export class FacebookComponent implements OnInit {

    $users: any;
    promotions = [];
    p = 0; // The current page

    search_promotion = "";
    search_text = "";

    constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => this.refreshPromotion(params));
        this.apiService.get("promotions/").subscribe(
            res => {
                for (let p of res["promotions"]) {
                    this.promotions.push(p)
                }
            },
            err => 0
        )
    }

    refreshPromotion(params) {
        let url = "users/";
        let added_one_param = false;

        if (params["promo"] && params["promo"] != -1) {
            url += added_one_param ? "&" : "?"; // Ok there is no need to add a condition, be let's be consistant
            url += "promo=" + params["promo"];
            added_one_param = true;
        }

        if (params["search"]) {
            url += added_one_param ? "&" : "?";
            url += "search=" + params["search"];
        }

        this.$users = this.apiService.get(url);
    }

    updateParameters() {

        let params = {};
        let promo = parseInt(this.search_promotion);
        if (!isNaN(promo) && promo != -1) {
            params["promo"] = promo;
        }

        if (this.search_text.length > 0) {
            params["search"] = this.search_text.trim();
        }

        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: params
            });
    }

}
