import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
declare var particlesJS: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginText: string;
    loginClass: string;
    passwordText: string;
    passwordClass: string;

    constructor(private _apiService: ApiService,
                private router: Router,
                private cookieService: CookieService) { }

    ngOnInit() {
        console.log("Authenticated : " + this._apiService.checkAuthentication())
        // Setup particles
        particlesJS.load('particle', 'assets/particles.json');
        // Check if the user is already connected
        if (this._apiService.checkAuthentication()) {
            this.router.navigate([''])
            return
        }
    }

    login() {
        var valid = true;
        if (!this.loginText) {
            valid = false
            this.loginClass = "uk-form-danger"
        } else {
            this.loginClass = ""
        }
        if (!this.passwordText) {
            valid = false
            this.passwordClass = "uk-form-danger"
        } else {
            this.passwordClass = ""
        }
        if (valid) {
            this._apiService.authenticate(this.loginText, this.passwordText).subscribe(
                data => {
                    localStorage.setItem("csrf_token", data["CSRFTokens"][0].CSRFToken)
                    localStorage.setItem("login", data["Login"])
                    this.cookieService.set("DDCSESSION", data["SessionTokens"][0].SessionToken)
                    // Redirect
                    if (localStorage.getItem("file_id") != null) {
                        var fileID = localStorage.getItem("file_id")
                        localStorage.removeItem("file_id")
                        this.router.navigate(['file/', fileID])
                    } else {
                        this.router.navigate([''])
                    }
                },
                err => {
                    this.passwordText = "";
                    this.loginText = "";
                    this.loginClass = "is-invalid";
                    this.passwordClass = "is-invalid"
                    console.log(err);

                }
            )
        }
    }

}
