import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const server = "http://localhost:8000/api/v1/";

@Injectable({ providedIn: 'root' })
export class ApiService {

    header: any;

    constructor(private http: HttpClient, private cookieService: CookieService) {
        this.header = new HttpHeaders().set('X-REQUESTED-WITH', 'XMLHttpRequest');
    }

    get(url: String){
        return this.http.get(
            server + url,
            {
                headers: this.header,
                withCredentials: true
            }
        )
    }

    post(url: String, body: any){
        return this.http.post(
            server + url,
            body,
            {
                headers: this.header,
                withCredentials: true
            }
        )
    }

    put(url: String, body: any){
        return this.http.put(
            server + url,
            body,
            {
                headers: this.header,
                withCredentials: true
            }
        )
    }

    delete(url: String){
        return this.http.delete(
            server + url,
            {
                headers: this.header,
                withCredentials: true
            }
        )
    }

    checkAuthentication() {
        return this.http.post(
            server + "auth/check/",
            null,
            {
                headers: this.header,
                withCredentials: true
            }
        );
    }

    authenticate(login: string, password: string) {
        return this.http.post(
            server + "auth/",
            {"pseudo": login, "password": password},
            {withCredentials: true}
        );
    }

    logout(){
        // Why simply deleting the cookie does not work ?
        // If you have an idea, please write me on Slack
        this.cookieService.set("jwt_access_token", "");
    }

    getUser() {
        return this.http.get(server + "auth/current_user/", {withCredentials: true})
    }
}
