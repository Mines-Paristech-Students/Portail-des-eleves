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

    constructor(private _apiService: ApiService, private router: Router, private app: AppComponent) { }

    logout(){
        this._apiService.logout();
        this.router.navigate(["/login"])
    }

    getPromotion(user){
        return "P" + parseInt(user.pseudo);
    }

    ngOnInit() {
        if(this.app.user == null){
            this.router.navigate(["/login"])
        }
    }
}
