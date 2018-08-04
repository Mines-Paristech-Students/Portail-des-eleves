import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    showNavBarMenu : Boolean = false ;
    user: any ;
	list_associations_short : any[];

    constructor(private _apiService: ApiService, private router: Router) { }

    ngOnInit() {
        if(window.localStorage && localStorage.getItem("user")) {
            this.user = JSON.parse(localStorage.getItem("user"));
        } else {
            this._apiService.checkAuthentication().subscribe(
                data => {
                    this.user = data;
                    if(window.localStorage) {
                        localStorage.setItem("user", JSON.stringify(data))
                    }
                },
                err => {
                    this.router.navigate(["/login"])
                }
            )
        }
		
		this._apiService.get("rest/associations/").subscribe(
			data=> {
				this.list_associations_short = <any []>data;
			}
		);
    }
	
	logout(){
        this._apiService.logout();
        this.router.navigate(["/login"])
    }

    getPromotion(user){
        return "P" + parseInt(user.id);
    }

    isActive(url){
        return [url].includes(this.router.url);
    }

}
