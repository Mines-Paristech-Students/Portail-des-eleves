import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ApiService} from "../api.service";
import {AppComponent} from "../app.component";

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    showNavBarMenu : Boolean = false ;
    user: any ;

    constructor(private _apiService: ApiService, private router: Router) { }

    logout(){
        this._apiService.logout();
        this.router.navigate(["/login"])
    }

    getPromotion(user){
        return "P" + parseInt(user.pseudo);
    }

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
    }
}
