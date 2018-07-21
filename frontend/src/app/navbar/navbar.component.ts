import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    user: String ;
    showNavBarMenu : Boolean = false ;

    constructor(private _apiService: ApiService, private router: Router) { }

    ngOnInit() {
        // Check if the user is already connected
        this._apiService.checkAuthentication().subscribe(
            data => {
                this.user = <String>data
            },
            err => {
                console.log('HomeComponent')
                console.log(err);
                this.router.navigate(['/login'])
            }
        )
    }

    logout(){
        this._apiService.logout();
        this.router.navigate(["/login"])
    }
}
