import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import {User} from "../models/user";

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    showNavBarMenu : Boolean = false ;
    user: User ;
	list_associations_short : any;

    constructor(private _apiService: ApiService, private router: Router) { }

    ngOnInit() {
        this._apiService.getUser().subscribe(
            data => {
                // The user variable explicitly needs to be from the User type
                //  so the ".promotion" property can be called from the html template.
                this.user = new User();
                Object.assign(this.user, data)
            },
            err => {
                console.log(err)
            }
        )

        this._apiService.get("associations/?limit=10").subscribe(
		    data => {
				this.list_associations_short = data["results"];
			}
		);
    }

    getPromotion(user){
        return "P" + parseInt(user.id);
    }

    isActive(url) {
        var regex = new RegExp(url);
        return regex.test(this.router.url);
    }

    logout(){
        this._apiService.logout().subscribe(
            data => {},
            err => {},
            () => {this.router.navigate(["/login"]);}
        );
    }
}
